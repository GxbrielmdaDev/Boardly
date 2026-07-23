import { create } from 'zustand';
import * as boardService from '../services/boardService';
import * as listService from '../services/listService';
import * as cardService from '../services/cardService';
import * as labelService from '../services/labelService';

const useBoardStore = create((set, get) => ({
  boards: [],
  currentBoard: null,
  lists: [],
  boardLabels: [],
  loading: false,

  loadBoards: async () => {
    const boards = await boardService.getBoards();
    set({ boards });
  },

  loadBoard: async (boardId) => {
    set({ loading: true });
    const [board, lists, boardLabels] = await Promise.all([
      boardService.getBoard(boardId),
      listService.getLists(boardId),
      labelService.getLabels(boardId),
    ]);
    const listsWithCards = await Promise.all(
      lists.map(async (list) => {
        const cards = await cardService.getCards(list.id);
        return { ...list, cards };
      })
    );
    set({ currentBoard: board, lists: listsWithCards, boardLabels, loading: false });
  },

  createBoard: async (data) => {
    const board = await boardService.createBoard(data);
    set((state) => ({ boards: [...state.boards, board] }));
    return board;
  },

  deleteBoard: async (id) => {
    await boardService.deleteBoard(id);
    set((state) => ({ boards: state.boards.filter((b) => b.id !== id) }));
  },

  createList: async (boardId, data) => {
    const list = await listService.createList(boardId, data);
    set((state) => ({ lists: [...state.lists, { ...list, cards: [] }] }));
  },

  deleteList: async (id) => {
    await listService.deleteList(id);
    set((state) => ({ lists: state.lists.filter((l) => l.id !== id) }));
  },

  createCard: async (listId, data) => {
    const card = await cardService.createCard(listId, data);
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === listId ? { ...l, cards: [...l.cards, card] } : l
      ),
    }));
  },

  moveCard: async (cardId, data) => {
    const card = await cardService.moveCard(cardId, data);
    set((state) => {
      const allCards = state.lists.flatMap((l) => l.cards);
      const moved = allCards.find((c) => c.id === cardId);
      if (!moved) return state;

      const removeFromList = (lists, id) =>
        lists.map((l) => ({
          ...l,
          cards: l.cards.filter((c) => c.id !== id),
        }));

      const without = removeFromList(state.lists, cardId);
      return {
        lists: without.map((l) =>
          l.id === data.list_id
            ? { ...l, cards: [...l.cards, card].sort((a, b) => a.position - b.position) }
            : l
        ),
      };
    });
  },

  updateCard: async (cardId, data) => {
    const updated = await cardService.updateCard(cardId, data);
    set((state) => ({
      lists: state.lists.map((l) => ({
        ...l,
        cards: l.cards.map((c) => (c.id === cardId ? { ...c, ...updated } : c)),
      })),
    }));
  },

  deleteCard: async (id) => {
    await cardService.deleteCard(id);
    set((state) => ({
      lists: state.lists.map((l) => ({
        ...l,
        cards: l.cards.filter((c) => c.id !== id),
      })),
    }));
  },

  loadLabels: async (boardId) => {
    const boardLabels = await labelService.getLabels(boardId);
    set({ boardLabels });
  },

  createLabel: async (boardId, data) => {
    await labelService.createLabel(boardId, data);
    await get().loadLabels(boardId);
  },

  updateLabel: async (labelId, data) => {
    await labelService.updateLabel(labelId, data);
    const { currentBoard } = get();
    if (currentBoard) {
      await get().loadLabels(currentBoard.id);
    }
  },

  deleteLabel: async (labelId) => {
    await labelService.deleteLabel(labelId);
    const { currentBoard } = get();
    if (currentBoard) {
      await get().loadLabels(currentBoard.id);
    }
  },
}));

export default useBoardStore;
