'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  DollarSign,
  Clock3,
  Boxes,
  ClipboardList,
  AlertCircle,
  X,
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { getToken } from '@/services/auth.service';
import {
  getMyProducts,
  createProduct,
  deleteProduct,
} from '@/services/product.service';

import { Product, CreateProductDto } from '@/types/product.types';
import ProductForm from '@/components/ProductForm';
import ProductTable from '@/components/ProductTable';
import AppHeader from '@/components/AppHeader';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);


  useEffect(() => {
    if (!isAuthenticated) return;

    const token = getToken();

    if (!token) return;

    setLoadingProducts(true);
    setError('');

    getMyProducts(token)
      .then(setProducts)
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, [isAuthenticated]);

  const handleCreate = async (
    dto: Omit<CreateProductDto, 'businessEntityId'>
  ) => {
    const token = getToken();

    if (!token || !user) return;

    setSubmitting(true);
    setError('');

    try {
      const newProduct = await createProduct(
        {
          ...dto,
          businessEntityId: user.businessEntityId as number,
        },
        token
      );

      setProducts((prev) => [...prev, newProduct]);

      // Cerrar modal después de crear correctamente
      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al crear el producto'
      );
    } finally {
      setSubmitting(false);
    }
  };


  const handleDelete = async (productId: number) => {
    const token = getToken();

    if (!token) return;

    const confirmed = window.confirm(
      '¿Eliminar este producto de tu catálogo?'
    );

    if (!confirmed) return;

    setError('');

    try {
      await deleteProduct(productId, token);

      setProducts((prev) =>
        prev.filter((p) => p.productId !== productId)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al eliminar el producto'
      );
    }
  };


  const statistics = useMemo(() => {
    if (products.length === 0) {
      return {
        total: 0,
        averagePrice: 0,
        averageDelivery: 0,
      };
    }

    const totalPrice = products.reduce(
      (sum, product) => sum + Number(product.standardPrice),
      0
    );

    const totalDelivery = products.reduce(
      (sum, product) => sum + Number(product.averageLeadTime),
      0
    );

    return {
      total: products.length,
      averagePrice: totalPrice / products.length,
      averageDelivery: totalDelivery / products.length,
    };
  }, [products]);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#164b8a] flex items-center justify-center animate-pulse">
            <Package className="w-5 h-5 text-white" />
          </div>

          <p className="text-sm text-slate-500">
            Cargando SmartPurchasing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <AppHeader />


      {/* ================= MAIN ================= */}
      <main className="relative overflow-hidden">

        {/* Grid de puntos */}
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-10">

          {/* ================= HERO ================= */}
          <section className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-blue-800" />
                  </div>

                  <span className="text-xs font-semibold tracking-[0.18em] text-blue-800 uppercase">
                    Tu catálogo de productos
                  </span>
                </div>

                <p className="mt-2 text-slate-500 max-w-xl">
                  Administra los productos asociados a tu cuenta y
                  mantén tu información de compras organizada.
                </p>
              </div>

              {/* Botón agregar */}
              <button
                onClick={() => {
                  setShowForm(true);
                  setError('');
                }}
                className="
                  inline-flex items-center justify-center gap-2
                  h-11 px-5
                  rounded-xl
                  bg-[#164b8a]
                  text-white
                  text-sm font-semibold
                  shadow-sm
                  hover:bg-[#0f3a6e]
                  hover:shadow-md
                  transition-all
                "
              >
                <Plus className="w-4 h-4" />
                Agregar producto
              </button>

            </div>
          </section>


          {/* ================= ERROR ================= */}
          {error && !showForm && (
            <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Ocurrió un problema
                </p>

                <p className="text-sm text-red-600 mt-0.5">
                  {error}
                </p>
              </div>

              <button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}


          {/* ================= STATS ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

            {/* Productos */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Productos registrados
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {statistics.total}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    En tu catálogo
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Boxes className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>


            {/* Precio */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Precio promedio
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    $
                    {statistics.averagePrice.toLocaleString(
                      'es-CO',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Precio estándar
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>


            {/* Entrega */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Entrega promedio
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {statistics.averageDelivery.toFixed(1)}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Días de entrega
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Clock3 className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>

          </section>


          {/* ================= PRODUCTS ================= */}
          <section>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Table header */}
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Productos
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Consulta y administra los productos de tu catálogo.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Catálogo sincronizado
                </div>

              </div>


              <div className="p-4">

                {loadingProducts ? (

                  <div className="py-16 flex flex-col items-center justify-center">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center animate-pulse">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>

                    <p className="text-sm text-slate-500 mt-3">
                      Cargando productos...
                    </p>

                  </div>

                ) : products.length === 0 ? (

                  <div className="py-16 flex flex-col items-center justify-center text-center">

                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <Package className="w-7 h-7 text-slate-400" />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-800">
                      Todavía no tienes productos
                    </h3>

                    <p className="mt-1 text-sm text-slate-400 max-w-sm">
                      Agrega tu primer producto para comenzar a
                      construir tu catálogo.
                    </p>

                    <button
                      onClick={() => {
                        setShowForm(true);
                        setError('');
                      }}
                      className="
                        mt-5
                        inline-flex items-center gap-2
                        rounded-xl
                        bg-[#164b8a]
                        px-4 py-2.5
                        text-sm font-medium
                        text-white
                        hover:bg-[#0f3a6e]
                        transition-colors
                      "
                    >
                      <Plus className="w-4 h-4" />
                      Agregar producto
                    </button>

                  </div>

                ) : (

                  <ProductTable
                    products={products}
                    onDelete={handleDelete}
                  />

                )}

              </div>
            </div>
          </section>

        </div>
      </main>


      {/* ===================================================== */}
      {/* ================= MODAL NUEVO PRODUCTO ============== */}
      {/* ===================================================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Fondo borroso */}
          <div
            className="
              absolute inset-0
              bg-slate-900/20
              backdrop-blur-sm
            "
            onClick={() => {
              if (!submitting) {
                setShowForm(false);
                setError('');
              }
            }}
          />

          {/* Modal */}
          <div
            className="
              relative
              z-10
              w-full
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              bg-white
              rounded-2xl
              border border-slate-200
              shadow-2xl
              animate-in
              fade-in
              zoom-in-95
              duration-200
            "
          >

            {/* Header del modal */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Nuevo producto
                  </h2>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Agrega la información del producto a tu catálogo.
                  </p>
                </div>

              </div>

              {/* Botón cerrar */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setShowForm(false);
                  setError('');
                }}
                className="
                  w-9 h-9
                  rounded-lg
                  flex items-center justify-center
                  text-slate-400
                  hover:text-slate-700
                  hover:bg-slate-100
                  transition-colors
                  disabled:opacity-50
                "
              >
                <X className="w-5 h-5" />
              </button>

            </div>


            {/* Error dentro del modal */}
            {error && (
              <div className="mx-6 mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 flex items-start gap-3">

                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    No se pudo crear el producto
                  </p>

                  <p className="text-sm text-red-600 mt-0.5">
                    {error}
                  </p>
                </div>

              </div>
            )}


            {/* Formulario */}
            <div className="p-6">

              <ProductForm
                onSubmit={handleCreate}
                submitting={submitting}
              />

            </div>

          </div>
        </div>
      )}

    </div>
  );
}