import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MotionMasterService } from './motion-master.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Device, ParameterValueType } from 'motion-master-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {

  hostname: string = '127.0.0.1';

  devices: Device[] = [];

  uploadForm = this.fb.group({
    'deviceRef': this.fb.control('1'),
    'parameterIndex': this.fb.control(''),
    'parameterSubindex': this.fb.control(''),
  });

  parameterValue?: ParameterValueType;

  constructor(
    private fb: FormBuilder,
    private motionMaster: MotionMasterService,
  ) { }

  async onConnect() {
    try {
      await this.motionMaster.connect(this.hostname);
      alert('Client connected!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Failed to connect! Error: ${err.message}`);
      }
    }
  }

  onDisconnect() {
    this.motionMaster.disconnect();
    alert('Client disconnected!');
  }

  onGetDevices() {
    this.motionMaster.client?.request.getDevices(5000).subscribe({
      next: (devices) => {
        console.log(devices);
        this.devices = devices;
      },
    });
  }

  async onUploadFormSubmit() {
    const deviceRef = this.uploadForm.value['deviceRef']?.trim() ?? 1;
    const index = Number(this.uploadForm.value['parameterIndex'] ?? 0);
    const subindex = Number(this.uploadForm.value['parameterSubindex'] ?? 0);
    try {
      this.parameterValue = await this.motionMaster.client?.request.upload(deviceRef, index, subindex);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Failed to upload the parameter value! Error: ${err.message}`);
      }
    }
  }

}
