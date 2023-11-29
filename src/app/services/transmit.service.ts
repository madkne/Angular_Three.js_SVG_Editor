import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TransmitChannelName } from '../common/types';

@Injectable({
  providedIn: 'root',
})
export class TransmitService<CHANNEL extends string = TransmitChannelName> {
  protected channels: { name: CHANNEL; channel: BehaviorSubject<any> }[] = [];

  constructor() {}

  emit<T = any>(name: CHANNEL, data: T) {
    // =>search for exist channel by name
    const channel = this.channels.find(i => i.name === name);
    if (channel) {
      channel.channel.next(data);
    }
    // =>if not found, create new channel
    else {
      this.add<T>(name, data);
    }
  }

  listen<T = any>(name: CHANNEL): BehaviorSubject<T> {
    // =>try to find channel by name
    const channel = this.channels.find(i => i.name === name);
    if (channel) {
      return channel.channel;
    }
    // =>if not found channel, create it and set undefined value to it!
    else {
      return this.add<T>(name, undefined).channel;
    }
  }

  protected add<T>(name: CHANNEL, initData: T | undefined) {
    // log('add new channel:', name);
    this.channels.push({
      name,
      channel: new BehaviorSubject<T | undefined>(initData),
    });
    return this.channels[this.channels.length - 1];
  }
}
