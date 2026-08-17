"use client";

import {
  useState,
  useEffect,
} from "react";

import Layout from "@/components/layout/Layout";

import Card from "@/components/dashboard/Card";

import DashboardHero from "@/components/dashboard/DashboardHero";

import {
  User,
  Calendar,
  Briefcase,
  IdCard,
  Hash,
  Users,
  ShieldCheck,
  UserPlus,
  Search,
} from "lucide-react";

interface SystemUser {

  id?: string;

  dni: string;

  nombre: string;

  id_reg: string;

  sexo: string;

  fecha_nac: string;

  cargo_contrato: string;

}

export default function UserManagementPage() {

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
    });

  /**
   * HANDLE INPUT CHANGE
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  /**
   * GET USERS
   */
  const loadUsers = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(
          "http://localhost:3006/users",
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

    loadUsers();

  }, []);

  /**
   * CREATE USER
   */
  const handleSubmit = async (
    e: React.FormEvent,
  ) => {

    e.preventDefault();

    try {

      setError("");
      setSuccess("");

      const response =
        await fetch(
          "http://localhost:3006/users",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData,
            ),
          },
        );

      if (!response.ok) {

        throw new Error(
          "Error registrando usuario",
        );

      }

      await response.json();

      /**
       * SUCCESS
       */
      setSuccess(
        "Usuario registrado correctamente",
      );

      /**
       * RELOAD TABLE
       */
      await loadUsers();

      /**
       * RESET FORM
       */
      setFormData({
        dni: "",
        nombre: "",
        id_reg: "",
        sexo: "",
        fecha_nac: "",
        cargo_contrato: "",
      });

    } catch (err) {

      console.error(err);

      setError(
        "No se pudo registrar usuario",
      );

    }

  };

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
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">

              <div className="flex items-center gap-2 mb-5">

                <UserPlus className="w-5 h-5 text-cyan-400" />

                <h2 className="text-lg font-semibold text-white">
                  Crear Usuario
                </h2>

              </div>

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
                      className="w-full bg-[#1F2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white"
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
                      className="w-full bg-[#1F2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white"
                    />

                  </div>

                </div>

                {/* ID REG */}
                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    ID Regimen
                  </label>

                  <div className="relative">

                    <Hash className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />

                    <input
                      type="text"
                      name="id_reg"
                      value={
                        formData.id_reg
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="Ingrese ID"
                      className="w-full bg-[#1F2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white"
                    />

                  </div>

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
                    className="w-full bg-[#1F2937] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white"
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
                      className="w-full bg-[#1F2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white"
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
                      className="w-full bg-[#1F2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white"
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 transition-all rounded-xl py-3 font-medium text-black"
                >
                  {loading
                    ? "Guardando..."
                    : "Registrar Usuario"}
                </button>

              </form>

            </div>

            {/* TABLE */}
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg overflow-hidden">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

                <div>

                  <h2 className="text-lg font-semibold text-white">
                    Usuarios del Sistema
                  </h2>

                  <p className="text-sm text-gray-400">
                    Lista de usuarios registrados.
                  </p>

                </div>

                <div className="relative w-full sm:w-72">

                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />

                  <input
                    type="text"
                    placeholder="Buscar usuario..."
                    className="w-full bg-[#1F2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white"
                  />

                </div>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full text-sm text-left text-gray-300">

                  <thead>

                    <tr className="border-b border-gray-800 text-gray-400">

                      <th className="py-3 px-4">
                        DNI
                      </th>

                      <th className="py-3 px-4">
                        Nombre
                      </th>

                      <th className="py-3 px-4">
                        Sexo
                      </th>

                      <th className="py-3 px-4">
                        Cargo
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {users.map(
                      (
                        user,
                        index,
                      ) => (

                        <tr
                          key={index}
                          className="border-b border-gray-900 hover:bg-[#1F2937] transition-all"
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