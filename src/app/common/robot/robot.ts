export class Robot {
    constructor(
      public id: string,
      public model: string,
      public name: string,
      public refNumber: string,
      public state: string,
      public type: string
    ) { }
  }
  
  export class RobotStatus {
    constructor(
      public roll: number,
      public pitch: number,
      public yaw: number,
      public gimbalRoll: number,
      public gimbalPitch: number,
      public gimbalYaw: number,
      public altitude: number,
      public velocityX: number,
      public velocityY: number,
      public velocityZ: number,
      public batteryLvl: number,
      public isCameraOk: boolean,
      public isDownloadingMedia: boolean,
      public isFlying: boolean,
      public isRecording: boolean,
      public timestamp: Date
    ) {}
  }
  
  export class AirportStatus {
    constructor(
      public current: number,
      public voltage: number,
      public holderStatus: string,
      public chargerStatus: string,
      public isInitialized: boolean,
      public timestamp: Date
    ) {}
  }
  