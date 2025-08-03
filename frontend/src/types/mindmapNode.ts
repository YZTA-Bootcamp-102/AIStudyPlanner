export interface MindmapNode {
  id: number;
  text: string;
  parent_id: number | null;
  position_x: number;
  position_y: number;
  is_ai_generated: boolean;
}