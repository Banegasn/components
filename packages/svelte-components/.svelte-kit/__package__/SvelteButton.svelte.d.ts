import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        label?: string;
        disabled?: boolean;
    };
    events: {
        'svelte-button-click': CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type SvelteButtonProps = typeof __propDef.props;
export type SvelteButtonEvents = typeof __propDef.events;
export type SvelteButtonSlots = typeof __propDef.slots;
export default class SvelteButton extends SvelteComponent<SvelteButtonProps, SvelteButtonEvents, SvelteButtonSlots> {
}
export {};
//# sourceMappingURL=SvelteButton.svelte.d.ts.map