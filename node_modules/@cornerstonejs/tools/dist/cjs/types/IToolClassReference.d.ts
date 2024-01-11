import { BaseTool } from '../tools';
declare type IToolClassReference = new <T extends BaseTool>(config: any) => T;
export default IToolClassReference;
