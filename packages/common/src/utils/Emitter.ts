export interface BaseEventsMap {
    [event: string]: (...args: any[]) => void;
}
export class Emiter<EventsMap extends BaseEventsMap = BaseEventsMap> {
    private _callbacks: {
        [K in keyof EventsMap]?: ((...args: Parameters<EventsMap[K]>) => void)[]
    } = {};
    on<K extends keyof EventsMap>(event: K, fn: EventsMap[K]) {
        (this._callbacks[event] ??= []).push(fn);
        return this;
    }
    once<K extends keyof EventsMap>(event: K, fn: (...args: Parameters<EventsMap[K]>) => void) {
        const self = this;
        const onceFn = function (...args: Parameters<EventsMap[K]>) {
            fn.apply(self, args);
            self.off(event, onceFn);
        } as EventsMap[K];
        this.on(event, onceFn);
        return this;
    }
    /**
     * @param event 
     * @param fn 如果没有传入就删除所有
     * @returns 
     */
    off<K extends keyof EventsMap>(event: K, fn?: EventsMap[K]) {
        const callbacks = this._callbacks[event];
        if (!callbacks) {
            return this;
        }
        if (fn === undefined) {
            delete this._callbacks[event];
            return this;
        }
        for (let i = 0; i < callbacks.length; i++) {
            const cb = callbacks[i];
            if (cb === fn) {
                callbacks.splice(i, 1);
                break;
            }
        }
        if (callbacks.length === 0) {
            delete this._callbacks[event];
        }
        return this;
    }

    emit<K extends keyof EventsMap>(event: K, ...params: Parameters<EventsMap[K]>) {
        let callbacks = this._callbacks[event];
        if (callbacks) {
            const callbacks_clone = callbacks.slice(0);
            for (const cb of callbacks_clone) {
                cb.apply(this, params)
            }
        }
        return this;
    }
}