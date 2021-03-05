import EventEmitter from 'events';

class CompEmitter extends EventEmitter {
    emitEvent(event: string, data: string) {
        this.emit(event, data);
    }
}

const compEmitter = new CompEmitter();

export default compEmitter;
