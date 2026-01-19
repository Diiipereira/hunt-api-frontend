import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg, type PixelCrop } from '../lib/avatar-utils';

interface AvatarCropperProps {
    imageSrc: string;
    onCancel: () => void;
    onConfirm: (blob: Blob) => void;
}

export function AvatarCropper({ imageSrc, onCancel, onConfirm }: AvatarCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [pixelCrop, setPixelCrop] = useState<PixelCrop | null>(null);
    const [loading, setLoading] = useState(false);

    const onCropComplete = useCallback((_: any, croppedAreaPixels: PixelCrop) => {
        setPixelCrop(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!pixelCrop || !imageSrc) return;

        setLoading(true);
        try {
            const croppedBlob = await getCroppedImg(imageSrc, pixelCrop);
            if (croppedBlob) {
                onConfirm(croppedBlob);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-hunt-dark-500/90 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-hunt-dark border-hunt-purple-300/10 w-full max-w-md overflow-hidden rounded-xl border shadow-2xl">
                <div className="border-hunt-light-300/10 border-b p-4">
                    <h3 className="text-hunt-light-300 text-lg font-bold">Ajustar Imagem</h3>
                </div>

                <div className="bg-hunt-dark-400/20 relative h-80 w-full">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                <div className="px-6 py-4">
                    <label className="block">
                        <span className="text-hunt-light-600 mb-2 block text-xs font-medium">Zoom</span>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="accent-hunt-purple bg-hunt-light-300/10 h-2 w-full appearance-none rounded-lg outline-none"
                        />
                    </label>
                </div>

                <div className="border-hunt-light-300/10 bg-hunt-dark-400/10 flex justify-end gap-3 border-t p-4">
                    <button
                        onClick={onCancel}
                        className="text-hunt-light-600 bg-hunt-dark-500 border-hunt-light-900/10 hover:bg-hunt-light-600/5 cursor-pointer rounded-md border px-4 py-2 text-sm font-bold transition-colors hover:text-white"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 cursor-pointer rounded-md px-4 py-2 text-sm font-bold shadow-lg transition-all disabled:opacity-50"
                    >
                        {loading ? 'Salvar Avatar' : 'Salvar Avatar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
