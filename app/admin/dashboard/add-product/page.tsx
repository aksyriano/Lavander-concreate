'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import Translate from '@/components/Translate';

const CATEGORIES = [
  'Long Dresses', 'Short Dresses', 'New Arrivals',
  "Women's Summer Coat's", "Women's Winter Coat's"
];

const categoryKeys: Record<string, string> = {
  'Long Dresses': 'longDresses',
  'Short Dresses': 'shortDresses',
  'New Arrivals': 'newArrivals',
  "Women's Summer Coat's": 'summerCoats',
  "Women's Winter Coat's": 'winterCoats'
};

interface ImagePreview {
  file: File;
  preview: string;
  uploaded: boolean;
  url: string;
}

export default function AddProduct() {
  const { lang } = useLanguage();
  const t = translations[lang] || translations['en'];
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    sizes: '',
    colors: '',
    category: CATEGORIES[0],
    stock: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews: ImagePreview[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
      url: ''
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadAllImages = async (): Promise<string[]> => {
    const unuploaded = imagePreviews.filter(p => !p.uploaded);
    if (unuploaded.length === 0) return imagePreviews.map(p => p.url);

    const formData = new FormData();
    unuploaded.forEach(p => formData.append('images', p.file));

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Image upload failed');
    const { urls } = await res.json();

    // Mark all as uploaded and store URLs
    let urlIdx = 0;
    setImagePreviews(prev => prev.map(p => {
      if (!p.uploaded) {
        const url = urls[urlIdx++];
        return { ...p, uploaded: true, url };
      }
      return p;
    }));

    // Return all URLs (already uploaded + newly uploaded)
    const alreadyUploaded = imagePreviews.filter(p => p.uploaded).map(p => p.url);
    return [...alreadyUploaded, ...urls];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (imagePreviews.length === 0) {
      setError(lang === 'ar' ? 'يرجى إضافة صورة واحدة على الأقل' : 'Please add at least one image');
      return;
    }

    setUploading(true);
    try {
      const imageUrls = await uploadAllImages();

      const body = {
        name: formData.name.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        images: imageUrls,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
        category: formData.category,
        stock: Number(formData.stock)
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create product');
      }

      setSuccess(true);
      setImagePreviews([]);
      setFormData({ name: '', price: '', description: '', sizes: '', colors: '', category: CATEGORIES[0], stock: '' });
      setTimeout(() => router.push('/admin/dashboard/products'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.formSection}>
      <h1 className={styles.title}><Translate k="addProductTitle">Add New Product</Translate></h1>

      {success && (
        <div className={styles.successBanner}>
          ✅ <Translate k="productCreated">Product created successfully! Redirecting...</Translate>
        </div>
      )}
      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder={t.productName}
          required
          value={formData.name}
          onChange={handleChange}
        />

        <div className={styles.formRow}>
          <div>
            <input
              type="number"
              name="price"
              placeholder={t.price}
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="number"
              name="stock"
              placeholder={t.stockQuantity}
              required
              min="0"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>
        </div>

        <textarea
          name="description"
          placeholder={t.productDescription}
          required
          value={formData.description}
          onChange={handleChange}
        />

        <select name="category" value={formData.category} onChange={handleChange}>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{t[categoryKeys[cat]] || cat}</option>
          ))}
        </select>

        {/* Multi-Image Upload */}
        <div className={styles.imageUploadArea}>
          <div className={styles.dropzone} onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className={styles.dropzoneIcon}>🖼️</div>
            <p className={styles.dropzoneText}>
              {lang === 'ar' ? 'اضغط لإضافة صور' : 'Click to add images'}
            </p>
            <p className={styles.dropzoneSubtext}>
              {lang === 'ar' ? 'يمكنك اختيار عدة صور مرة واحدة' : 'You can select multiple images at once'}
            </p>
          </div>

          {imagePreviews.length > 0 && (
            <div className={styles.previewGrid}>
              {imagePreviews.map((img, idx) => (
                <div key={idx} className={styles.previewItem}>
                  <img src={img.preview} alt={`preview-${idx}`} />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeImage(idx)}
                    title="Remove"
                  >
                    ✕
                  </button>
                  {img.uploaded && (
                    <div className={styles.uploadingBadge} style={{ background: 'rgba(212,237,218,0.85)', color: '#155724' }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {uploading && (
            <p className={styles.uploadProgress}>
              {lang === 'ar' ? '⏳ جاري رفع الصور...' : '⏳ Uploading images...'}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="sizes"
            placeholder={t.sizesHint}
            value={formData.sizes}
            onChange={handleChange}
          />
          <p className={styles.hint}><Translate k="sizeHint">Use size codes separated by commas.</Translate></p>
        </div>

        <div>
          <input
            type="text"
            name="colors"
            placeholder={t.colorsHint}
            value={formData.colors}
            onChange={handleChange}
          />
          <p className={styles.hint}><Translate k="colorHint">Use color names or hex codes separated by commas.</Translate></p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={uploading}>
            <Translate k="saveProduct">Save Product</Translate>
          </button>
          <Link href="/admin/dashboard/products" style={{ padding: '0.75rem 1.5rem', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: 'inherit' }}>
            <Translate k="cancel">Cancel</Translate>
          </Link>
        </div>
      </form>
    </div>
  );
}


