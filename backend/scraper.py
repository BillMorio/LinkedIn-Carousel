import os
import hashlib
from apify_client import ApifyClient
from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime, timedelta
import re

class ScraperEngine:
    def __init__(self, token: str):
        self.client = ApifyClient(token)

    def fetch_profile_posts(self, profile_url: str, time_limit: str = "week", max_posts: int = 10):
        """
        Runs the 'harvestapi/linkedin-profile-posts' actor on Apify.
        """
        run_input = {
            "includeQuotePosts": True,
            "includeReposts": True,
            "maxComments": 0,
            "maxPosts": max_posts,
            "maxReactions": 0,
            "postedLimit": time_limit,
            "scrapeComments": False,
            "scrapeReactions": False,
            "targetUrls": [profile_url]
        }
        
        # Run the actor and wait for it to finish
        run = self.client.actor("harvestapi/linkedin-profile-posts").call(run_input=run_input)
        
        # Fetch results from the run's dataset
        dataset_items = list(self.client.dataset(run["defaultDatasetId"]).list_items().items)
        
        results = []
        profile_metadata = None
        
        for item in dataset_items:
            if item.get("type") != "post":
                continue
            
            # Extract profile metadata from the first post found
            if not profile_metadata and item.get("author"):
                author = item.get("author")
                profile_metadata = {
                    "avatar_url": author.get("profilePic"),
                    "headline": author.get("headline"),
                    "display_name": author.get("name")
                }
            
            # Media Type detection & URL extraction
            post_type = "text"
            media_url = None
            images = item.get("postImages", [])
            if images:
                post_type = "image" if len(images) == 1 else "carousel"
                media_url = images[0].get("url")
            
            document = item.get("document")
            if document:
                post_type = "carousel"
                # Try to get cover page if available
                cover_pages = document.get("coverPages", [])
                if cover_pages:
                    media_url = cover_pages[0].get("url") or cover_pages[0].get("imageUrls", [None])[0]
            
            if item.get("videoUrl") or item.get("videoDescription"):
                post_type = "video"
                media_url = item.get("videoUrl")
            
            # Engagement
            engagement = item.get("engagement", {})
            likes = engagement.get("likes", 0)
            comments = engagement.get("comments", 0)
            reposts = engagement.get("reposts", 0)
            views = item.get("viewCount", 0)
            
            # Content normalization
            content = item.get("content", "")
            topic = content.split("\n")[0][:50] if content else "Untitled Post"

            # Date Extraction
            posted_at = None
            posted_at_raw = None
            posted_at_obj = item.get("postedAt")
            if posted_at_obj:
                if posted_at_obj.get("date"):
                    try:
                        posted_at = datetime.fromisoformat(posted_at_obj.get("date").replace("Z", "+00:00"))
                    except:
                        pass
                posted_at_raw = posted_at_obj.get("postedAgoText")
            
            results.append({
                "topic": topic,
                "raw_content": content,
                "source": "scraped",
                "niche_tag": item.get("author", {}).get("name", "Unknown"),
                "post_type": post_type or "text",
                "engagement_count": likes,
                "comments_count": comments,
                "reposts_count": reposts,
                "view_count": views,
                "original_url": item.get("linkedinUrl"),
                "posted_at": posted_at,
                "posted_at_raw": posted_at_raw
            })
            
        return results, profile_metadata

    def fetch_profile_details(self, profile_url: str):
        """Runs 'harvestapi/linkedin-profile-scraper' to get the About/bio + headline.

        Uses the cheapest mode ('Profile details no email', ~$0.004/profile).
        """
        run_input = {
            "profileScraperMode": "Profile details no email ($4 per 1k)",
            "queries": [profile_url],
        }
        run = self.client.actor("harvestapi/linkedin-profile-scraper").call(run_input=run_input)
        items = list(self.client.dataset(run["defaultDatasetId"]).list_items().items)
        if not items:
            return None
        item = items[0]

        first = item.get("firstName") or ""
        last = item.get("lastName") or ""
        name = (f"{first} {last}").strip() or item.get("name")

        return {
            "about": item.get("about") or item.get("summary"),
            "headline": item.get("headline"),
            "display_name": name,
            "avatar_url": item.get("photo") or item.get("profilePicture") or item.get("pictureUrl"),
        }

    def parse_relative_date(self, date_str: str):
        """Parses strings like '3 days ago', '1 week ago', '15h' etc."""
        if not date_str: return None
        now = datetime.utcnow()
        date_str = date_str.lower()
        
        try:
            # Handle short forms like '32m', '15h', '1d', '2w'
            match = re.match(r'^(\d+)([mhdwy])$', date_str)
            if match:
                val, unit = int(match.group(1)), match.group(2)
                if unit == 'm': return now - timedelta(minutes=val)
                if unit == 'h': return now - timedelta(hours=val)
                if unit == 'd': return now - timedelta(days=val)
                if unit == 'w': return now - timedelta(weeks=val)
                if unit == 'y': return now - timedelta(days=val * 365)

            # Handle full strings
            num_match = re.search(r'(\d+)', date_str)
            if not num_match: return None
            val = int(num_match.group(1))
            
            if 'minute' in date_str: return now - timedelta(minutes=val)
            if 'hour' in date_str: return now - timedelta(hours=val)
            if 'day' in date_str: return now - timedelta(days=val)
            if 'week' in date_str: return now - timedelta(weeks=val)
            if 'month' in date_str: return now - timedelta(days=val*30)
            if 'year' in date_str: return now - timedelta(days=val*365)
        except:
            pass
        return None

    def fetch_keyword_posts(self, query: str, content_type: str = "documents", max_results: int = 20, sort_by: str = "date_posted"):
        """
        Runs the 'powerai/linkedin-posts-search-scraper' actor on Apify.
        """
        run_input = {
            "query": query,
            "maxResults": max_results,
            "content_type": content_type,
            "sort_by": sort_by
        }
        
        # Run the actor and wait for it to finish
        run = self.client.actor("powerai/linkedin-posts-search-scraper").call(run_input=run_input)
        
        # Fetch results from the run's dataset
        dataset_items = list(self.client.dataset(run["defaultDatasetId"]).list_items().items)
        
        results = []
        for item in dataset_items:
            # Media Type detection & URL extraction for search results
            post_type = "text"
            media_url = None
            
            doc_comp = item.get("documentComponent")
            if doc_comp:
                post_type = "carousel"
                # Use the first cover page of the first size category
                cover_pages = doc_comp.get("coverPages", [])
                if cover_pages:
                    images = cover_pages[0].get("imageUrls", [])
                    if images:
                        media_url = images[0]
            elif item.get("videoComponent"):
                post_type = "video"
                # Video components often have a thumbnail
                media_url = item.get("videoComponent", {}).get("thumbnail")
            elif item.get("imageComponent"):
                post_type = "image"
                media_url = item.get("imageComponent", {}).get("url")
            
            # Engagement
            social = item.get("social_details", {})
            likes = social.get("numLikes", 0)
            comments = social.get("numComments", 0)
            reposts = social.get("numShares", 0)
            
            # Author Metadata
            actor = item.get("actor", {})
            
            # Content normalization
            content = item.get("commentary", "")
            topic = content.split("\n")[0][:50] if content else "Untitled Post"
            
            # Date Extraction
            posted_at_raw = item.get("postedAt") # Absolute from search scraper
            posted_at = None
            if posted_at_raw:
                try:
                    posted_at = datetime.fromisoformat(posted_at_raw.replace("Z", "+00:00"))
                except:
                    pass
            
            # If no absolute date, try relative from actor_subDescription
            if not posted_at:
                sub_desc = actor.get("actor_subDescription", "")
                if sub_desc:
                    # Extract first part like "32m" or "1h" before the dot
                    posted_at_raw = sub_desc.split("•")[0].strip()
                    posted_at = self.parse_relative_date(posted_at_raw)
            
            results.append({
                "topic": topic,
                "raw_content": content,
                "source": "scraped",
                "niche_tag": query, # Use the query as the tag for search results
                "post_type": post_type,
                "engagement_count": likes,
                "comments_count": comments,
                "reposts_count": reposts,
                "view_count": 0, # Search scraper usually doesn't return views
                "original_url": item.get("share_url"),
                "author_name": actor.get("actor_name"),
                "author_headline": actor.get("actor_description"),
                "author_avatar_url": actor.get("actor_image") if actor.get("actor_image") != "na" else None,
                "author_profile_url": actor.get("actor_navigationContext"),
                "post_type": post_type or "text",
                "posted_at": posted_at,
                "posted_at_raw": posted_at_raw
            })
            
        return results

def run_profile_scrape(db: Session, profile_url: str, token: str, time_limit: str = "week", max_posts: int = 10, watchlist_id: int = None):
    if not token or token == "your_token_here":
        return [], None

    engine = ScraperEngine(token)
    results, metadata = engine.fetch_profile_posts(profile_url, time_limit=time_limit, max_posts=max_posts)
    
    all_ideas = []
    for res in results:
        # Check if already exists by hash
        raw_content = res.get('raw_content') or ""
        content_hash = hashlib.md5(raw_content.encode()).hexdigest()
        exists = db.query(models.Idea).filter(models.Idea.content_hash == content_hash).first()
        
        if not exists:
            db_idea = models.Idea(
                topic=res.get('topic', 'Untitled'),
                raw_content=res.get('raw_content') or "",
                source=res.get('source', 'scraped'),
                niche_tag=res.get('niche_tag'),
                watchlist_id=watchlist_id,
                content_hash=content_hash,
                post_type=res.get('post_type', 'text'),
                engagement_count=res.get('engagement_count', 0),
                comments_count=res.get('comments_count', 0),
                reposts_count=res.get('reposts_count', 0),
                view_count=res.get('view_count', 0),
                original_url=res.get('original_url'),
                posted_at=res.get('posted_at'),
                posted_at_raw=res.get('posted_at_raw'),
                media_url=res.get('media_url'),
                created_at=datetime.utcnow()
            )
            db.add(db_idea)
            db.flush()
            all_ideas.append(db_idea)
        else:
            # Backfill missing date info / profile link if available
            updated = False
            if not exists.posted_at and res.get('posted_at'):
                exists.posted_at = res.get('posted_at')
                updated = True
            if not exists.posted_at_raw and res.get('posted_at_raw'):
                exists.posted_at_raw = res.get('posted_at_raw')
                updated = True
            if watchlist_id and not exists.watchlist_id:
                exists.watchlist_id = watchlist_id
                updated = True

            if updated:
                db.flush()
            all_ideas.append(exists)

    db.commit()
    return all_ideas, metadata

def run_profile_details(db: Session, profile_url: str, token: str, watchlist_id: int = None):
    """Scrape a profile's About/bio and persist it onto the watchlist row. Returns the details dict."""
    if not token or token == "your_token_here":
        return None

    engine = ScraperEngine(token)
    details = engine.fetch_profile_details(profile_url)
    if not details:
        return None

    if watchlist_id:
        wl = db.query(models.Watchlist).filter(models.Watchlist.id == watchlist_id).first()
        if wl:
            if details.get("about"):
                wl.about = details["about"]
            if details.get("headline") and not wl.headline:
                wl.headline = details["headline"]
            if details.get("avatar_url") and not wl.avatar_url:
                wl.avatar_url = details["avatar_url"]
            db.commit()
    return details

def run_keyword_search(db: Session, query: str, token: str, content_type: str = "documents", max_results: int = 20, sort_by: str = "date_posted"):
    if not token or token == "your_token_here":
        return []

    engine = ScraperEngine(token)
    results = engine.fetch_keyword_posts(query, content_type=content_type, max_results=max_results, sort_by=sort_by)
    
    all_ideas = []
    for res in results:
        # Check if already exists by hash
        raw_content = res.get('raw_content') or ""
        content_hash = hashlib.md5(raw_content.encode()).hexdigest()
        exists = db.query(models.Idea).filter(models.Idea.content_hash == content_hash).first()
        
        if not exists:
            db_idea = models.Idea(
                topic=res.get('topic', 'Untitled'),
                raw_content=res.get('raw_content') or "",
                source=res.get('source', 'scraped'),
                niche_tag=res.get('niche_tag'),
                content_hash=content_hash,
                post_type=res.get('post_type', 'text'),
                engagement_count=res.get('engagement_count', 0),
                comments_count=res.get('comments_count', 0),
                reposts_count=res.get('reposts_count', 0),
                view_count=res.get('view_count', 0),
                original_url=res.get('original_url'),
                author_name=res.get('author_name'),
                author_headline=res.get('author_headline'),
                author_avatar_url=res.get('author_avatar_url'),
                author_profile_url=res.get('author_profile_url'),
                posted_at=res.get('posted_at'),
                posted_at_raw=res.get('posted_at_raw'),
                media_url=res.get('media_url'),
                created_at=datetime.utcnow()
            )
            db.add(db_idea)
            db.flush() # Populate ID
            all_ideas.append(db_idea)
        else:
            # Backfill missing date info if available
            updated = False
            if not exists.posted_at and res.get('posted_at'):
                exists.posted_at = res.get('posted_at')
                updated = True
            if not exists.posted_at_raw and res.get('posted_at_raw'):
                exists.posted_at_raw = res.get('posted_at_raw')
                updated = True
            
            if updated:
                db.flush()
            all_ideas.append(exists)
    
    db.commit()
    return all_ideas
