import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: '685431',
      key: '9038e997c53a8ce7ac04',
      secret: 'f0700a4d9d48852043fc',
      cluster: 'mt1',
      useTLS: true,
    });
  }

  triggerEvent(channelName: string, eventName: string, data: any) {
    this.pusher.trigger(channelName, eventName, data);
  }
}
