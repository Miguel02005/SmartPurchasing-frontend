import React from 'react';
import { Truck } from 'lucide-react';
import { ShipMethod } from '@/types/ship-method.types';

interface ShipMethodTableProps {
  shipMethods: ShipMethod[];
}

const money = (n: number) =>
  Number(n || 0).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ShipMethodTable: React.FC<ShipMethodTableProps> = ({ shipMethods }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Método de envío
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Costo base
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Tarifa
            </th>
          </tr>
        </thead>
        <tbody>
          {shipMethods.map((sm) => (
            <tr
              key={sm.shipMethodId}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {sm.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      ID {sm.shipMethodId}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-slate-600">
                  ${money(sm.shipBase)}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-slate-600">
                  ${money(sm.shipRate)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShipMethodTable;
