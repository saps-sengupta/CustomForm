let extensionService;
const extensionServiceModule = () => {
    return new class {
        post({type, payload}) {
            return extensionService.post({
                type,
                payload,
            });
        }
        post({type}) {
            return extensionService.post({
                type
            });
        }
    };
};

export default extensionServiceModule;