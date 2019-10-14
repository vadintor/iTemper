import {log} from '@/services/logger';
export class Notice {
    public message = '';
    public queue: string[] = [];

    public publish(message: string) {
        log.debug('Notice: ' + message);
        if (message !== this.message) {
            this.queue.push(message);
            if (this.queue.length === 1) {
                this.message = message;
                this.setTimer();
            }
        }
    }
    private reset(): void {
        if (this.queue.length === 1 ) {
            this.message = '';
            this.queue.shift();
        } else {
            this.message = this.queue.shift() || '';
            this.setTimer();
        }
    }
    private setTimer() {
        const timeout = 1_250;
        setTimeout(() => {this.reset(); }, timeout);
    }
}
