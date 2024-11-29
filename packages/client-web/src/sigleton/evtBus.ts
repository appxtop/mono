import { Emiter, UserModel } from "@mono/common";
type EventsMapType = {
    "API:USER_UPDATE": (user: UserModel | null) => void;
    "API:Unauthorized": () => void;
    "API:INVALID": () => void;
    "REQUEST": (evtName: string, data: any) => void;
}
export const evtBus = new Emiter<EventsMapType>();
