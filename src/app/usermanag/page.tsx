"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

import Layout from "@/components/layout/Layout";

import Card from "@/components/dashboard/Card";

import DashboardHero from "@/components/dashboard/DashboardHero";

import { getAuthApi } from "@/lib/api";
import {
  getAccessToken,
  getUser,
  isAdmin,
} from "@/lib/auth";

import {
  User,
  Calendar,
  Briefcase,
  IdCard,
  Users,
  ShieldCheck,
  UserPlus,
  Search,
  FileSpreadsheet,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface SystemUser {

  id?: string;

  dni: string;

  nombre: string;

  id_reg: string;

  sexo: string;

  fecha_nac: string;

  cargo_contrato: string;
  rol?: string;
  cuenta_activa?: boolean;
}

export default function UserManagementPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  /**
   * USERS
   */
  const [users, setUsers] =
    useState<SystemUser[]>([]);

  /**
   * LOADING
   */
  const [loading, setLoading] =
    useState(false);

  /**
   * ERROR
   */
  const [error, setError] =
    useState("");

  /**
   * SUCCESS
   */
  const [success, setSuccess] =
    useState("");

  /**
   * FORM DATA
   */
  const [formData, setFormData] =
    useState<SystemUser>({
      dni: "",
      nombre: "",
      id_reg: "",
      sexo: "",
      fecha_nac: "",
      cargo_contrato: "",
      rol: "user",
      cuenta_activa: true,
    });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<
    "dni" | "nombre" | "sexo" | "cargo" | "rol" | "estado" | null
  >(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [importing, setImporting] = useState(false);
  const [adminNewPassword, setAdminNewPassword] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);

  const emptyForm = (): SystemUser => ({
    dni: "",
    nombre: "",
    id_reg: "",
    sexo: "",
    fecha_nac: "",
    cargo_contrato: "",
    rol: "user",
    cuenta_activa: true,
  });

  const formatDateInput = (value?: string | null) => {
    if (!value) {
      return "";
    }

    return String(value).slice(0, 10);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setAdminNewPassword("");
    setError("");
    setSuccess("");
  };

  const selectUser = (user: SystemUser) => {
    if (!user.id) {
      setError("No se pudo identificar al usuario");
      return;
    }

    setEditingId(user.id);
    setAdminNewPassword("");
    setFormData({
      id: user.id,
      dni: user.dni || "",
      nombre: user.nombre || "",
      id_reg: user.id_reg || "",
      sexo: user.sexo || "",
      fecha_nac: formatDateInput(user.fecha_nac),
      cargo_contrato: user.cargo_contrato || "",
      rol: user.rol === "admin" ? "admin" : "user",
      cuenta_activa: user.cuenta_activa !== false,
    });
    setError("");
    setSuccess("");
  };

  /**
   * HANDLE INPUT CHANGE
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, type } = e.target;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const authHeaders = () => {
    const token = getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  /**
   * GET USERS
   */
  const loadUsers = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(
          `${getAuthApi()}/users`,
          {
            headers: authHeaders(),
          },
        );

      if (!response.ok) {

        throw new Error(
          "Error obteniendo usuarios",
        );

      }

      const data =
        await response.json();

      setUsers(data);

    } catch (err) {

      console.error(err);

      setError(
        "No se pudo obtener usuarios",
      );

    } finally {

      setLoading(false);

    }

  };

  /**
   * INITIAL LOAD
   */
  useEffect(() => {
    const session = getUser();

    if (!session?.dni) {
      router.replace("/login");
      return;
    }

    if (!isAdmin(session)) {
      router.replace("/dashboard");
      return;
    }

    setAllowed(true);
    loadUsers();
  }, [router]);

  const handleRoleChange = async (
    userId: string | undefined,
    rol: string,
  ) => {
    if (!userId) {
      setError("No se pudo identificar al usuario");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${getAuthApi()}/users/${userId}/role`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ rol }),
        },
      );

      const data = await response.json().catch(() => null);
      const message = Array.isArray(data?.message)
        ? data.message.join(" ")
        : data?.message;

      if (!response.ok) {
        setError(message || "No se pudo actualizar la categoría");
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, rol }
            : user,
        ),
      );
      setSuccess("Categoría actualizada correctamente");
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la categoría");
    }
  };

  const handleResetPassword = async () => {
    if (!editingId) {
      return;
    }

    if (adminNewPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${getAuthApi()}/users/${editingId}/password`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ newPassword: adminNewPassword }),
        },
      );

      const data = await response.json().catch(() => null);
      const message = Array.isArray(data?.message)
        ? data.message.join(" ")
        : data?.message;

      if (!response.ok) {
        setError(message || "No se pudo restablecer la contraseña");
        return;
      }

      setAdminNewPassword("");
      setSuccess("Contraseña restablecida correctamente");
    } catch (err) {
      console.error(err);
      setError("No se pudo restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleImportExcel = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      setImporting(true);
      setError("");
      setSuccess("");

      const body = new FormData();
      body.append("file", file);

      const token = getAccessToken();
      const response = await fetch(`${getAuthApi()}/users/import`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body,
      });

      const data = await response.json().catch(() => null);
      const message = Array.isArray(data?.message)
        ? data.message.join(" ")
        : data?.message;

      if (!response.ok) {
        setError(message || "No se pudo importar el Excel");
        return;
      }

      await loadUsers();
      setSuccess(
        `Importación lista: ${data.created || 0} creados, ${data.updated || 0} actualizados` +
          (data.skipped
            ? `, ${data.skipped} omitidos`
            : ""),
      );
    } catch (err) {
      console.error(err);
      setError("No se pudo importar el Excel de usuarios");
    } finally {
      setImporting(false);
    }
  };

  /**
   * CREATE / UPDATE USER
   */
  const handleSubmit = async (
    e: React.FormEvent,
  ) => {

    e.preventDefault();

    try {

      setError("");
      setSuccess("");
      setLoading(true);

      const payload = {
        dni: formData.dni.trim(),
        nombre: formData.nombre.trim(),
        id_reg: formData.id_reg,
        sexo: formData.sexo,
        fecha_nac: formData.fecha_nac || undefined,
        cargo_contrato: formData.cargo_contrato.trim(),
        rol: formData.rol || "user",
        cuenta_activa: formData.cuenta_activa !== false,
        ...(editingId
          ? {}
          : { password: formData.dni.trim() }),
      };

      const response = await fetch(
        editingId
          ? `${getAuthApi()}/users/${editingId}`
          : `${getAuthApi()}/users`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json().catch(() => null);
      const message = Array.isArray(data?.message)
        ? data.message.join(" ")
        : data?.message;

      if (response.status === 401) {
        setError(
          editingId
            ? "Tu sesión expiró por tiempo. Vuelve a iniciar sesión para actualizar el usuario."
            : "Tu sesión expiró por tiempo. Vuelve a iniciar sesión para registrar el usuario.",
        );
        return;
      }

      if (!response.ok) {
        setError(
          message ||
            (editingId
              ? "No se pudo actualizar el usuario"
              : "No se pudo registrar usuario"),
        );
        return;
      }

      setSuccess(
        editingId
          ? "Usuario actualizado correctamente"
          : "Usuario registrado correctamente",
      );

      await loadUsers();
      setEditingId(null);
      setFormData(emptyForm());

    } catch (err) {

      console.error(err);

      setError(
        editingId
          ? "No se pudo actualizar el usuario"
          : "No se pudo registrar usuario",
      );

    } finally {
      setLoading(false);
    }

  };

  type SortKey = "dni" | "nombre" | "sexo" | "cargo" | "rol" | "estado";

  const getSortValue = (user: SystemUser, key: SortKey) => {
    switch (key) {
      case "dni":
        return user.dni || "";
      case "nombre":
        return (user.nombre || "").toLowerCase();
      case "sexo":
        return (user.sexo || "").toLowerCase();
      case "cargo":
        return (user.cargo_contrato || "").toLowerCase();
      case "rol":
        return user.rol === "admin" ? "0" : "1";
      case "estado":
        return user.cuenta_activa === false ? "1" : "0";
      default:
        return "";
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const term = search.trim().toLowerCase();

      if (!term) {
        return true;
      }

      return `${user.dni} ${user.nombre} ${user.cargo_contrato} ${user.rol}`
        .toLowerCase()
        .includes(term);
    })
    .sort((a, b) => {
      if (!sortKey) {
        return 0;
      }

      const left = getSortValue(a, sortKey);
      const right = getSortValue(b, sortKey);
      const diff = left.localeCompare(right, "es", { numeric: true });
      return sortDir === "asc" ? diff : -diff;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc");
      } else {
        setSortKey(null);
        setSortDir("asc");
      }
      return;
    }

    setSortKey(key);
    setSortDir("asc");
  };

  const SortHeader = ({
    label,
    column,
  }: {
    label: string;
    column: SortKey;
  }) => (
    <button
      type="button"
      onClick={() => toggleSort(column)}
      className="inline-flex items-center gap-1 text-gray-400 transition hover:text-white"
      title={`Ordenar por ${label.toLowerCase()}`}
    >
      {label}
      <span className="inline-flex flex-col leading-none">
        <ChevronUp
          size={12}
          className={
            sortKey === column && sortDir === "asc"
              ? "text-green-400"
              : "text-gray-600"
          }
        />
        <ChevronDown
          size={12}
          className={`-mt-0.5 ${
            sortKey === column && sortDir === "desc"
              ? "text-green-400"
              : "text-gray-600"
          }`}
        />
      </span>
    </button>
  );

  if (!allowed) {
    return null;
  }

  return (
    <Layout>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 lg:gap-6">

        {/* HERO */}
        <div className="hidden lg:block">
          <DashboardHero />
        </div>

        {/* CONTENT */}
        <div className="min-w-0">

          <div className="lg:hidden mb-4">
            <DashboardHero mobile />
          </div>

          <h1 className="text-2xl font-bold mb-2 leading-tight">
            Gestión de Usuarios
          </h1>

          <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">
            Administra los accesos y registros del sistema.
          </p>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">

            <Card
              title="Usuarios Registrados"
              value={String(
                users.length,
              )}
              icon={<Users />}
            />

            <Card
              title="Registros Activos"
              value={String(
                users.length,
              )}
              icon={<ShieldCheck />}
            />

            <Card
              title="Nuevo Usuario"
              value="Disponible"
              icon={<UserPlus />}
            />

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">

            {/* FORM */}
            <div className="tech-card p-5">

              <div className="mb-5 flex items-center justify-between gap-2">

                <div className="flex items-center gap-2">

                  <UserPlus className="w-5 h-5 text-green-400" />

                  <h2 className="text-lg font-semibold text-white">
                    {editingId ? "Modificar Usuario" : "Crear Usuario"}
                  </h2>

                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/5"
                  >
                    Nuevo
                  </button>
                )}

              </div>

              <p className="mb-4 text-xs text-gray-400">
                {editingId
                  ? "Estás editando un usuario. Guarda los cambios o pulsa Nuevo para crear otro."
                  : "Haz clic en un usuario de la lista para modificarlo aquí."}
              </p>

              {/* SUCCESS */}
              {success && (
                <div className="mb-4 bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-xl text-sm">
                  {success}
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="mb-4 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form
                onSubmit={
                  handleSubmit
                }
                className="space-y-4"
              >

                {/* DNI */}
                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    DNI
                  </label>

                  <div className="relative">

                    <IdCard className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />

                    <input
                      type="text"
                      name="dni"
                      value={
                        formData.dni
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="Ingrese DNI"
                      className="w-full rounded-xl border border-green-400/20 bg-black/25 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                    />

                  </div>

                </div>

                {/* NOMBRE */}
                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    Nombre Completo
                  </label>

                  <div className="relative">

                    <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />

                    <input
                      type="text"
                      name="nombre"
                      value={
                        formData.nombre
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="Ingrese nombre"
                      className="w-full rounded-xl border border-green-400/20 bg-black/25 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                    />

                  </div>

                </div>

                {/* ID REG */}
                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    Régimen laboral
                  </label>

                  <select
                    name="id_reg"
                    value={
                      formData.id_reg
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full rounded-xl border border-green-400/20 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                  >
                    <option value="">
                      Seleccione régimen
                    </option>
                    <option value="D.L. 1057-TR">
                      D.L. 1057-TR
                    </option>
                    <option value="D.L. 1057-DIR">
                      D.L. 1057-DIR
                    </option>
                    <option value="D.L. 1057-IND">
                      D.L. 1057-IND
                    </option>
                    <option value="D.L. 276">
                      D.L. 276
                    </option>
                    <option value="D.L. 728">
                      D.L. 728
                    </option>
                    <option value="D.L. 1401">
                      D.L. 1401
                    </option>
                    <option value="CAS TR">
                      CAS TR — Contrato CAS trabajador
                    </option>
                    <option value="CAS DIR">
                      CAS DIR — Contrato CAS directivo
                    </option>
                  </select>

                </div>

                {/* SEXO */}
                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    Sexo
                  </label>

                  <select
                    name="sexo"
                    value={
                      formData.sexo
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full rounded-xl border border-green-400/20 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                  >

                    <option value="">
                      Seleccione sexo
                    </option>

                    <option value="Masculino">
                      Masculino
                    </option>

                    <option value="Femenino">
                      Femenino
                    </option>

                  </select>

                </div>

                {/* FECHA */}
                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    Fecha Nacimiento
                  </label>

                  <div className="relative">

                    <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />

                    <input
                      type="date"
                      name="fecha_nac"
                      value={
                        formData.fecha_nac
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="w-full rounded-xl border border-green-400/20 bg-black/25 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                    />

                  </div>

                </div>

                {/* CARGO */}
                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    Cargo Contrato
                  </label>

                  <div className="relative">

                    <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />

                    <input
                      type="text"
                      name="cargo_contrato"
                      value={
                        formData.cargo_contrato
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="Ingrese cargo"
                      className="w-full rounded-xl border border-green-400/20 bg-black/25 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                    />

                  </div>

                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Categoría
                  </label>
                  <select
                    name="rol"
                    value={formData.rol || "user"}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-green-400/20 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-green-400/20 bg-black/20 px-4 py-3 text-sm text-gray-200 transition hover:border-green-400/40">
                  <input
                    type="checkbox"
                    name="cuenta_activa"
                    checked={formData.cuenta_activa !== false}
                    onChange={handleChange}
                    className="h-4 w-4 accent-green-500"
                  />
                  <span>
                    <span className="font-medium text-white">Cuenta Activa</span>
                    <span className="mt-0.5 block text-xs text-gray-400">
                      Si está desmarcada, el usuario no podrá iniciar sesión.
                    </span>
                  </span>
                </label>

                {editingId && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="mb-3 text-sm font-medium text-white">
                      Restablecer contraseña
                    </p>
                    <input
                      type="password"
                      value={adminNewPassword}
                      onChange={(e) => setAdminNewPassword(e.target.value)}
                      placeholder="Nueva contraseña"
                      minLength={6}
                      className="mb-3 w-full rounded-xl border border-green-400/20 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                    />
                    <button
                      type="button"
                      disabled={loading || adminNewPassword.length < 6}
                      onClick={handleResetPassword}
                      className="w-full rounded-xl border border-green-400/30 px-4 py-2.5 text-sm font-medium text-green-300 transition hover:bg-green-500/10 disabled:opacity-60"
                    >
                      Aplicar nueva contraseña
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-accent py-3 font-semibold text-white transition hover:bg-green-500 disabled:opacity-60"
                >
                  {loading
                    ? "Guardando..."
                    : editingId
                      ? "Actualizar Usuario"
                      : "Registrar Usuario"}
                </button>

              </form>

            </div>

            {/* TABLE */}
            <div className="tech-card flex max-h-[min(70vh,42rem)] flex-col overflow-hidden p-5 xl:max-h-[calc(100vh-11rem)]">

              <div className="mb-5 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-white">
                    Usuarios del Sistema
                  </h2>

                  <p className="text-sm text-gray-400">
                    Haz clic en una fila para editarla. Importa Excel (hoja Alta)
                    para alta masiva; si el DNI ya existe, se actualiza.
                  </p>

                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

                  <button
                    type="button"
                    disabled={importing || loading}
                    onClick={() => importInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-60"
                  >
                    <FileSpreadsheet size={16} />
                    {importing ? "Importando..." : "Importar Excel"}
                  </button>

                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    className="hidden"
                    onChange={handleImportExcel}
                  />

                  <div className="relative w-full sm:w-72">

                    <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar usuario..."
                      className="w-full rounded-xl border border-green-400/20 bg-black/25 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-green-400/70 focus:ring-2 focus:ring-green-400/20"
                    />

                  </div>

                </div>

              </div>

              <div className="min-h-0 flex-1 overflow-auto">

                <table className="w-full text-sm text-left text-gray-300">

                  <thead className="sticky top-0 z-10 bg-[#0d241f]">

                    <tr className="border-b border-green-400/15 text-gray-400">

                      <th className="py-3 px-4">
                        <SortHeader label="DNI" column="dni" />
                      </th>

                      <th className="py-3 px-4">
                        <SortHeader label="Nombre" column="nombre" />
                      </th>

                      <th className="py-3 px-4">
                        <SortHeader label="Sexo" column="sexo" />
                      </th>

                      <th className="py-3 px-4">
                        <SortHeader label="Cargo" column="cargo" />
                      </th>

                      <th className="py-3 px-4">
                        <SortHeader label="Categoría" column="rol" />
                      </th>

                      <th className="py-3 px-4">
                        <SortHeader label="Estado" column="estado" />
                      </th>

                      <th className="py-3 px-4">
                        Cambiar tipo
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredUsers.map(
                      (
                        user,
                        index,
                      ) => (

                        <tr
                          key={user.id || index}
                          onClick={() => selectUser(user)}
                          className={`cursor-pointer border-b border-white/10 transition duration-300 hover:bg-green-400/10 ${
                            editingId === user.id
                              ? "bg-green-500/15"
                              : ""
                          }`}
                        >

                          <td className="py-4 px-4">
                            {user.dni}
                          </td>

                          <td className="py-4 px-4 font-medium text-white">
                            {user.nombre}
                          </td>

                          <td className="py-4 px-4">
                            {user.sexo}
                          </td>

                          <td className="py-4 px-4">
                            {
                              user.cargo_contrato
                            }
                          </td>

                          <td className="py-4 px-4">
                            {user.rol === "admin"
                              ? "Administrador"
                              : "Usuario"}
                          </td>

                          <td className="py-4 px-4">
                            {user.cuenta_activa === false ? (
                              <span className="rounded-full bg-red-500/20 px-2.5 py-1 text-xs text-red-300">
                                Inactiva
                              </span>
                            ) : (
                              <span className="rounded-full bg-green-500/20 px-2.5 py-1 text-xs text-green-300">
                                Activa
                              </span>
                            )}
                          </td>

                          <td
                            className="py-4 px-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <select
                              value={user.rol === "admin" ? "admin" : "user"}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  e.target.value,
                                )
                              }
                              className="rounded-lg border border-green-400/20 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-green-400/70"
                            >
                              <option value="user">
                                Usuario
                              </option>
                              <option value="admin">
                                Administrador
                              </option>
                            </select>
                          </td>

                        </tr>

                      ),
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}