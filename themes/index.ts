import { Theme } from '../types/carousel';
import { ExecutionStepsTheme } from './execution-steps';
import { ToolWorkflowTheme } from './tool-workflow';

export const ThemeRegistry: Record<string, Theme> = {
  'execution-steps': ExecutionStepsTheme,
  'tool-workflow': ToolWorkflowTheme,
};

export const getTheme = (id: string): Theme => {
  return ThemeRegistry[id] || ExecutionStepsTheme;
};
