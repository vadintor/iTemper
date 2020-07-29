import { reactive, UnwrapRef } from '@vue/composition-api';

export abstract class BaseStore<T extends object> {
    protected mState: UnwrapRef<T>;

    constructor() {
        const data = this.data();
        this.setup(data);
        this.mState = reactive (data);
    }

    protected get state() {
        return this.mState;
    }

    protected set state(value: UnwrapRef<T>)  {
        this.mState = value;
    }
    protected abstract data(): T;

    protected abstract setup(data: T): void;
}
