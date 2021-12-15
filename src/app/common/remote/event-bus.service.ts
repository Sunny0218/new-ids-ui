import { Injectable } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';

export const ROBOT_ON_DRONE_CHANGED = 'robot:onDroneChanged';
export const ROBOT_ON_AIRPORT_CHANGED = 'robot:onAirportChanged';

export const MISSION_ON_RACK_SLOT_CLICKED = 'mission:onRackSlotClicked';
export const MISSION_ON_RACK_SLOT_SELECTED = 'mission:onRackSlotSelected'; // multiselect
export const MISSION_ON_NEW_MISSION_SUBMITTED = 'mission:onNewMissionSubmitted';
export const MISSION_ON_STEP_UPDATED = 'mission:onStepUpdated';
export const MISSION_ON_MISSION_ENDED = 'mission:onMissionEnded';
export const MISSION_ON_RACK_UPDATED = 'mission:onRackUpdated';
export const MISSION_ON_RELOAD_CLICKED = 'mission:onReloadClicked';

export const MEDIA_ON_NEW_IMAGE_LOADED = 'media:onNewImageLoaded';

export const STOCK_ON_STOCK_TAKING_RESULT_UPDATED = 'stock:onStockTakingResultUpdated';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  constructor(public eventBus: NgEventBus) {}
}
