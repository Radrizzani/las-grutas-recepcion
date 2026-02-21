import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const InvoicesListModule = ({ onBack }) => {
    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-brand-cream">LISTADO DE FACTURAS</h2>
                <Button variant="ghost" onClick={onBack}>← Volver</Button>
            </div>
            
            <Card title="Facturas Emitidas">
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-2">📝 Módulo en desarrollo</p>
                    <p>Aquí se mostrará el listado completo de facturas con:</p>
                    <ul className="mt-4 text-left max-w-md mx-auto space-y-1 text-sm">
                        <li>• Número de factura y fecha</li>
                        <li>• Nombre del cliente</li>
                        <li>• Unidad y período</li>
                        <li>• Monto total y estado de pago</li>
                        <li>• Filtros por fecha, cliente, unidad</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};
