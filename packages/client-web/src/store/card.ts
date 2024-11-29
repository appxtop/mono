import { CardModel, CardType, logger, UpdateCardsType } from "@mono/common";
import _ from "lodash";
import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import pinia from "./pinia";
import { userStore } from "./user";
import { ws } from "../sigleton/ws";
import { evtBus } from "../sigleton/evtBus";

const useCardStore = defineStore('card', () => {
    const maxCardIndex = ref(0);
    //订阅数据
    const subData: {
        gameTime: number,
        cards: {
            [_id: string]: CardModel
        },
        cards_type: {
            [type in CardType]?: CardModel[]
        }
    } = reactive({
        gameTime: 0,
        cards: {},
        cards_type: {}
    });
    function updateCard(data: UpdateCardsType) {
        _.merge(subData, data);
        const cards_type: { [type in CardType]?: CardModel[] } = {}
        for (const id in subData.cards) {
            const item = subData.cards[id];
            cards_type[item.type] ??= [];
            cards_type[item.type]!.push(item);
        }
        subData.cards_type = cards_type;
    }
    return { maxCardIndex, subData, updateCard };
});

export const cardStore = useCardStore(pinia);


let channel = '';
let channel_fn: ((data: any) => void) | null = null;
watch(() => userStore.user, (user) => {
    if (channel) {
        ws.unSubscribe(channel);
        if (channel_fn) {
            ws.off(channel, channel_fn);
        }
        evtBus.off('REQUEST')
        channel = '';
    }
    if (!user) {
        return;
    }
    channel = 'cards:' + user._id;
    channel_fn = (data: {
        gameTime: number,
        cards: {
            [id: string]: CardModel
        }
    }) => {
        cardStore.updateCard(data);
    }
    logger.log('订阅:', channel);
    ws.subscribe(channel);
    ws.on(channel, channel_fn);
});