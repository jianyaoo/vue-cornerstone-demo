export declare function addProvider(provider: (type: string, ...query: string[]) => any, priority?: number): void;
export declare function removeProvider(provider: (type: string, query: any) => {
    any: any;
}): void;
export declare function removeAllProviders(): void;
declare function getMetaData(type: string, ...queries: any[]): any;
export { getMetaData as get };
//# sourceMappingURL=metaData.d.ts.map