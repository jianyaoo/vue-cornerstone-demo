import { state } from '../index';
function destroy() {
    while (state.synchronizers.length > 0) {
        const synchronizer = state.synchronizers.pop();
        synchronizer.destroy();
    }
}
export default destroy;
//# sourceMappingURL=destroy.js.map