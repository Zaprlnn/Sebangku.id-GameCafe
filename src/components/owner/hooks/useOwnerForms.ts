import { useState } from "react";

export function useOwnerForms() {
  const [gamesView, setGamesView] = useState<"grid" | "list">("grid");
  const [fbView, setFbView] = useState<"grid" | "list">("grid");
  const [showFormModal, setShowFormModal] = useState(false);
  const [formType, setFormType] = useState<"game" | "fb">("game");
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<any>(null);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<any>(null);

  const [fieldName, setFieldName] = useState("");
  const [fieldCategory, setFieldCategory] = useState("");
  const [fieldPrice, setFieldPrice] = useState(0);
  const [fieldStock, setFieldStock] = useState(1);
  const [fieldStatus, setFieldStatus] = useState("");
  const [fieldImageUrl, setFieldImageUrl] = useState("");
  const [fieldEmoji, setFieldEmoji] = useState("🎲");
  const [fieldMinPlayers, setFieldMinPlayers] = useState(2);
  const [fieldMaxPlayers, setFieldMaxPlayers] = useState(6);
  const [isDragOver, setIsDragOver] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "game" | "fb";
    id: string;
  } | null>(null);

  const triggerAddGame = () => {
    setFormType("game");
    setFormMode("add");
    setFieldName("");
    setFieldCategory("Strategy");
    setFieldPrice(10000);
    setFieldStock(1);
    setFieldStatus("Available");
    setFieldImageUrl("");
    setFieldEmoji("🎲");
    setFieldMinPlayers(2);
    setFieldMaxPlayers(6);
    setEditId(null);
    setShowFormModal(true);
  };

  const triggerEditGame = (game: any) => {
    setFormType("game");
    setFormMode("edit");
    setEditId(game.id);
    setFieldName(game.name);
    setFieldCategory(game.category);
    setFieldPrice(game.price);
    setFieldStock(game.stock);
    setFieldStatus(game.status);
    setFieldImageUrl(game.image || "");
    setFieldEmoji(game.emoji || "🎲");
    setFieldMinPlayers(game.minPlayers || 2);
    setFieldMaxPlayers(game.maxPlayers || 6);
    setShowFormModal(true);
  };

  const triggerAddFb = () => {
    setFormType("fb");
    setFormMode("add");
    setFieldName("");
    setFieldCategory("Food");
    setFieldPrice(15000);
    setFieldStatus("In Stock");
    setFieldImageUrl("");
    setFieldEmoji("🍛");
    setEditId(null);
    setShowFormModal(true);
  };

  const triggerEditFb = (item: any) => {
    setFormType("fb");
    setFormMode("edit");
    setEditId(item.id);
    setFieldName(item.name);
    setFieldCategory(item.category);
    setFieldPrice(item.price);
    setFieldStatus(item.status);
    setFieldImageUrl(item.image || "");
    setFieldEmoji(item.emoji || "🍛");
    setShowFormModal(true);
  };

  return {
    gamesView,
    setGamesView,
    fbView,
    setFbView,
    showFormModal,
    setShowFormModal,
    formType,
    setFormType,
    formMode,
    setFormMode,
    editId,
    setEditId,
    isSavingForm,
    setIsSavingForm,
    isDeleting,
    setIsDeleting,
    togglingId,
    setTogglingId,
    fieldName,
    setFieldName,
    fieldCategory,
    setFieldCategory,
    fieldPrice,
    setFieldPrice,
    fieldStock,
    setFieldStock,
    fieldStatus,
    setFieldStatus,
    fieldImageUrl,
    setFieldImageUrl,
    fieldEmoji,
    setFieldEmoji,
    fieldMinPlayers,
    setFieldMinPlayers,
    fieldMaxPlayers,
    setFieldMaxPlayers,
    isDragOver,
    setIsDragOver,
    deleteConfirm,
    setDeleteConfirm,
    triggerAddGame,
    triggerEditGame,
    triggerAddFb,
    triggerEditFb,
  };
}
