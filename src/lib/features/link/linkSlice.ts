import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LinkProps } from "@/types";

interface LinksState {
     links: LinkProps[];
}

const initialState: LinksState = {
     links: [],
};

export const linkSlice = createSlice({
     name: "links",
     initialState,
     reducers: {
          setLinks: (state, action: PayloadAction<LinkProps[]>) => {
               state.links = action.payload;
          },

          removeLink: (state, action: PayloadAction<number>) => {
               state.links = state.links.filter(
                    (item) => item.link.id !== action.payload,
               );
          },
     },
});

export const { setLinks, removeLink } = linkSlice.actions;

export default linkSlice.reducer;
