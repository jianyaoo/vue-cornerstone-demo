import HtmlDataAccessHelper from './DataAccessHelper/HtmlDataAccessHelper';
import HttpDataAccessHelper from './DataAccessHelper/HttpDataAccessHelper';
import JSZipDataAccessHelper from './DataAccessHelper/JSZipDataAccessHelper';
import LiteHttpDataAccessHelper from './DataAccessHelper/LiteHttpDataAccessHelper';

export function has(type: string): boolean;
export function get(type?: string, options?: object): HtmlDataAccessHelper | HttpDataAccessHelper | JSZipDataAccessHelper | LiteHttpDataAccessHelper
export function registerType(type: string, fn: any): void;

export interface DataAccessHelper {
	/**
	 * 
	 * @param {String} type 
	 */
	has(type: string): boolean;

	/**
	 * 
	 * @param {String} type 
	 * @param options 
	 */
	get(type?: string, options?: object): HtmlDataAccessHelper | HttpDataAccessHelper | JSZipDataAccessHelper | LiteHttpDataAccessHelper

	/**
	 * 
	 * @param {String} type 
	 * @param fn 
	 */
	registerType(type: string, fn: any): void;
}

export declare const DataAccessHelper: {
	has: typeof has,
	get: typeof get,
	registerType: typeof registerType,
}

export default DataAccessHelper;
