import { Injectable } from '@angular/core';
import { createMotionMasterClient, MotionMasterClient } from 'motion-master-client';

@Injectable({
  providedIn: 'root'
})
export class MotionMasterService {

  client?: MotionMasterClient | null;

  constructor() { }

  async connect(hostname: string) {
    this.client = createMotionMasterClient(hostname);
    return this.client.whenReady(5000);
  }

  disconnect() {
    this.client?.closeSockets();
    this.client = null;
  }

}
