import { supabase } from "../../../lib/supabase";

export function useOwnerActions(ownerData: any, ownerForms: any) {
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result)
        ownerForms.setFieldImageUrl(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const confirmDelete = (type: "game" | "fb", id: string) => {
    ownerForms.setDeleteConfirm({ type, id });
  };

  const executeDelete = async () => {
    if (!ownerForms.deleteConfirm) return;
    if (ownerForms.isDeleting) return;
    ownerForms.setIsDeleting(true);

    if (ownerForms.deleteConfirm.type === "game") {
      ownerData.setBoardGames((prev: any[]) =>
        prev.filter(
          (g) => String(g.id) !== String(ownerForms.deleteConfirm.id),
        ),
      );
    } else {
      ownerData.setFbMenu((prev: any[]) =>
        prev.filter(
          (m) => String(m.id) !== String(ownerForms.deleteConfirm.id),
        ),
      );
    }
    const deleteId = ownerForms.deleteConfirm.id;
    const deleteType = ownerForms.deleteConfirm.type;
    ownerForms.setDeleteConfirm(null);

    try {
      if (deleteType === "game") {
        await supabase
          .from("game_sessions")
          .delete()
          .eq("boardgame_id", deleteId);
        const { error } = await supabase
          .from("boardgames")
          .delete()
          .eq("id", deleteId);
        if (error) {
          alert("Gagal hapus game: " + error.message);
          await ownerData.refreshDbData();
        }
      } else {
        const { error } = await supabase
          .from("menus")
          .delete()
          .eq("id", deleteId);
        if (error) {
          alert("Gagal hapus menu: " + error.message);
          await ownerData.refreshDbData();
        }
      }
    } finally {
      ownerForms.setIsDeleting(false);
    }
  };

  const handleToggleStatusGame = async (id: any) => {
    if (ownerForms.togglingId === id) return;
    const game = ownerData.boardGames.find((g: any) => g.id === id);
    if (!game) return;

    const newStatus = game.status === "Available" ? "Maintenance" : "Available";
    ownerForms.setTogglingId(id);
    ownerData.setBoardGames((prev: any[]) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: newStatus, active: newStatus === "Available" }
          : g,
      ),
    );

    try {
      const { error } = await supabase
        .from("boardgames")
        .update({ status: newStatus, active: newStatus === "Available" })
        .eq("id", id);
      if (error) {
        ownerData.setBoardGames((prev: any[]) =>
          prev.map((g) =>
            g.id === id
              ? { ...g, status: game.status, active: game.active }
              : g,
          ),
        );
        alert("Gagal ubah status: " + error.message);
      }
    } finally {
      ownerForms.setTogglingId(null);
    }
  };

  const handleToggleStatusFb = async (id: any) => {
    if (ownerForms.togglingId === id) return;
    const item = ownerData.fbMenu.find((m: any) => m.id === id);
    if (!item) return;

    const newUiStatus =
      item.status === "In Stock" ? "Out of Stock" : "In Stock";
    const newDbStatus =
      newUiStatus === "In Stock" ? "Available" : "Unavailable";
    ownerForms.setTogglingId(id);
    ownerData.setFbMenu((prev: any[]) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: newUiStatus, active: newUiStatus === "In Stock" }
          : m,
      ),
    );

    try {
      const { error } = await supabase
        .from("menus")
        .update({ status: newDbStatus })
        .eq("id", id);
      if (error) {
        ownerData.setFbMenu((prev: any[]) =>
          prev.map((m) =>
            m.id === id
              ? { ...m, status: item.status, active: item.active }
              : m,
          ),
        );
        alert("Gagal ubah status: " + error.message);
      }
    } finally {
      ownerForms.setTogglingId(null);
    }
  };

  const handleSaveForm = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!ownerForms.fieldName.trim()) return;
    if (ownerForms.isSavingForm) return;
    ownerForms.setIsSavingForm(true);

    try {
      if (ownerForms.formType === "game") {
        if (ownerForms.formMode === "add") {
          const { error } = await supabase.from("boardgames").insert({
            name: ownerForms.fieldName,
            title: ownerForms.fieldName,
            category: ownerForms.fieldCategory,
            genre: ownerForms.fieldCategory,
            stock: ownerForms.fieldStock,
            rented: 0,
            price: ownerForms.fieldPrice,
            status: ownerForms.fieldStatus,
            active: ownerForms.fieldStatus === "Available",
            image: ownerForms.fieldImageUrl,
            emoji: ownerForms.fieldEmoji,
            min_players: ownerForms.fieldMinPlayers,
            max_players: ownerForms.fieldMaxPlayers,
          });
          if (error) {
            alert("Gagal tambah game: " + error.message);
            return;
          }
        } else {
          const { error } = await supabase
            .from("boardgames")
            .update({
              name: ownerForms.fieldName,
              title: ownerForms.fieldName,
              category: ownerForms.fieldCategory,
              genre: ownerForms.fieldCategory,
              stock: ownerForms.fieldStock,
              price: ownerForms.fieldPrice,
              status: ownerForms.fieldStatus,
              active: ownerForms.fieldStatus === "Available",
              image: ownerForms.fieldImageUrl,
              emoji: ownerForms.fieldEmoji,
              min_players: ownerForms.fieldMinPlayers,
              max_players: ownerForms.fieldMaxPlayers,
            })
            .eq("id", ownerForms.editId);
          if (error) {
            alert("Gagal update game: " + error.message);
            return;
          }
        }
      } else {
        const dbStatus =
          ownerForms.fieldStatus === "In Stock" ? "Available" : "Unavailable";
        if (ownerForms.formMode === "add") {
          const { error } = await supabase
            .from("menus")
            .insert({
              name: ownerForms.fieldName,
              category: ownerForms.fieldCategory,
              price: ownerForms.fieldPrice,
              status: dbStatus,
              image: ownerForms.fieldImageUrl,
            });
          if (error) {
            alert("Gagal tambah menu: " + error.message);
            return;
          }
        } else {
          const { error } = await supabase
            .from("menus")
            .update({
              name: ownerForms.fieldName,
              category: ownerForms.fieldCategory,
              price: ownerForms.fieldPrice,
              status: dbStatus,
              image: ownerForms.fieldImageUrl,
            })
            .eq("id", ownerForms.editId);
          if (error) {
            alert("Gagal update menu: " + error.message);
            return;
          }
        }
      }
      ownerForms.setShowFormModal(false);
      await ownerData.refreshDbData();
    } finally {
      ownerForms.setIsSavingForm(false);
    }
  };

  return {
    handleImageFile,
    confirmDelete,
    executeDelete,
    handleToggleStatusGame,
    handleToggleStatusFb,
    handleSaveForm,
  };
}
