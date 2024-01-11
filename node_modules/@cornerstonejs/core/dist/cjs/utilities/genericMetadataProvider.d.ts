declare const metadataProvider: {
    add: (imageId: string, payload: any) => void;
    get: (type: string, imageId: string) => any;
    clear: () => void;
};
export default metadataProvider;
