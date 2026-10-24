import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, CURRENCY } from '../../../config/constants.js';
import { useNotification } from '../../../context/NotificationContext.jsx';
import {
  saveStoredProduct,
  compressImageToWebP,
  readFileAsDataURL,
  parseVideoUrl,
} from '../../../utils/productStorageManager.js';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Film,
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon,
  Crown,
  DollarSign,
  Video,
} from 'lucide-react';
import './BouquetEditModal.css';

export default function BouquetEditModal({ product, isNew = false, isOpen, onClose, onSaveSuccess }) {
  const { i18n } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const isCreateMode = isNew || !product?.id;

  const imageFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);

  // Form states
  const [nameAr, setNameAr] = useState(product?.name_ar || '');
  const [nameEn, setNameEn] = useState(product?.name_en || '');
  const [descAr, setDescAr] = useState(product?.description_ar || '');
  const [descEn, setDescEn] = useState(product?.description_en || '');
  const [price, setPrice] = useState(product?.price || '');
  const [salePrice, setSalePrice] = useState(product?.sale_price || '');
  const [category, setCategory] = useState(product?.category || 'wedding');
  const [stockQuantity, setStockQuantity] = useState(product?.stock_quantity ?? 10);
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);

  const [componentsAr, setComponentsAr] = useState(
    Array.isArray(product?.components_ar) ? product.components_ar.join(', ') : ''
  );

  // Media states: start empty in create mode so user is prompted to upload photos
  const [images, setImages] = useState(
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : isCreateMode
      ? []
      : ['/images/bouquet-save-the-date.jpg']
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState(product?.video_url || '');
  const [newVideoInputUrl, setNewVideoInputUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Active section tab: 'details' | 'media' | 'pricing'
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen) return null;

  // Handle uploading and auto-compressing images from local device to WebP
  const handleImageFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setIsUploadingImage(true);
      const convertedDataUrls = await Promise.all(
        files.map(async (file) => {
          try {
            return await compressImageToWebP(file, 1200, 0.82);
          } catch {
            return await readFileAsDataURL(file);
          }
        })
      );
      setImages((prev) => [...prev, ...convertedDataUrls]);
      showSuccess(
        isAr
          ? `تم ضغط وحفظ ${files.length} صور للبوكيه بصيغة WebP خفيفة بنجاح`
          : `Added and compressed ${files.length} images successfully`
      );
    } catch (err) {
      console.error('Error reading images:', err);
      showError(isAr ? 'تعذر رفع بعض الصور، يرجى المحاولة مرة أخرى' : 'Failed to upload images');
    } finally {
      setIsUploadingImage(false);
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
    }
  };

  // Handle adding image via external URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
    showSuccess(isAr ? 'تمت إضافة رابط الصورة بنجاح' : 'Image URL added');
  };

  // Remove an image
  const handleRemoveImage = (indexToRemove) => {
    if (images.length <= 1) {
      showError(isAr ? 'يجب الإبقاء على صورة واحدة على الأقل للبوكيه' : 'Keep at least one image');
      return;
    }
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Make an image the primary cover (move to index 0)
  const handleSetPrimaryImage = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [selected, ...rest];
    });
    showSuccess(isAr ? 'تم تعيين الصورة كصورة رئيسية للبوكيه ✦' : 'Set as primary cover image');
  };

  // Handle uploading video file from device with strict size limit to prevent QuotaExceeded
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict 2MB size limit for directly uploaded videos in LocalStorage
    if (file.size > 2 * 1024 * 1024) {
      showError(
        isAr
          ? 'حجم الفيديو كبير جداً للتخزين المحلي (أقصى حد 2MB). يرجى وضع رابط يوتيوب أو فيميو بدلاً من ذلك لحفظ سرعة المتجر 🎬'
          : 'Video file too large (>2MB). Please paste a YouTube or Vimeo link instead.'
      );
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploadingVideo(true);
      const videoDataUrl = await readFileAsDataURL(file);
      setVideoUrl(videoDataUrl);
      showSuccess(isAr ? 'تم رفع فيديو البوكيه بنجاح 🎬' : 'Bouquet video uploaded');
    } catch (err) {
      console.error('Error reading video:', err);
      showError(isAr ? 'تعذر قراءة ملف الفيديو' : 'Failed to read video file');
    } finally {
      setIsUploadingVideo(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    }
  };

  // Handle setting video URL
  const handleSetVideoUrl = () => {
    if (!newVideoInputUrl.trim()) return;
    setVideoUrl(newVideoInputUrl.trim());
    setNewVideoInputUrl('');
    showSuccess(isAr ? 'تم حفظ رابط الفيديو بنجاح 🎬' : 'Video link attached');
  };

  // Remove video
  const handleRemoveVideo = () => {
    setVideoUrl('');
    showSuccess(isAr ? 'تمت إزالة الفيديو من البوكيه' : 'Video removed');
  };

  // Parse video preview
  const parsedVideo = parseVideoUrl(videoUrl);

  // Submit & Save
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameAr.trim()) {
      showError(isAr ? 'يرجى إدخال اسم البوكيه بالعربية' : 'Please provide Arabic name');
      setActiveTab('details');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      showError(isAr ? 'يرجى تحديد سعر صالح للبوكيه' : 'Please provide a valid price');
      setActiveTab('pricing');
      return;
    }
    // Validation: Image is strictly required!
    if (!images || images.length === 0) {
      showError(
        isAr
          ? 'يرجى رفع صورة واحدة على الأقل من جهازك أو وضع رابط صورة للبوكيه الجديد 📷'
          : 'Please upload or attach at least one photo for the bouquet 📷'
      );
      setActiveTab('media');
      return;
    }

    setIsSaving(true);

    const productId = product?.id || `${Date.now()}`;

    const updatedData = {
      id: productId,
      name_ar: nameAr.trim(),
      name_en: nameEn.trim() || nameAr.trim(),
      description_ar: descAr.trim(),
      description_en: descEn.trim() || descAr.trim(),
      price: parseFloat(price),
      sale_price: salePrice ? parseFloat(salePrice) : null,
      category,
      stock_quantity: parseInt(stockQuantity, 10) || 0,
      is_available: isAvailable,
      is_featured: isFeatured,
      rating: product?.rating || 5.0,
      reviews_count: product?.reviews_count || 1,
      components_ar: componentsAr
        ? componentsAr.split(',').map((s) => s.trim()).filter(Boolean)
        : ['ورد جوري فاخر', 'شريط حريري مذهب'],
      components_en: product?.components_en || ['Fresh Royal Flowers', 'Silk Ribbon'],
      images,
      video_url: videoUrl.trim() || null,
    };

    try {
      saveStoredProduct(updatedData);
      setIsSaving(false);
      showSuccess(
        isCreateMode
          ? (isAr ? `تمت إضافة ونشر تحفة «${nameAr}» بنجاح! 🌹` : `Bouquet "${nameAr}" created & published! 🌹`)
          : (isAr ? `تم تحديث وحفظ بيانات وصور وفيديو «${nameAr}» بنجاح! 🌹` : `Bouquet "${nameAr}" updated successfully!`)
      );

      if (onSaveSuccess) onSaveSuccess(updatedData);
      onClose();
    } catch (saveErr) {
      setIsSaving(false);
      showError(saveErr.message || (isAr ? 'فشل حفظ الباقة في مساحة التخزين' : 'Failed to save bouquet'));
    }
  };

  return (
    <div className="bouquet-edit-modal-overlay" onClick={onClose}>
      <div
        className="bouquet-edit-modal-container glass-luxury animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="edit-modal-header">
          <div className="edit-header-title-group">
            <div className="edit-badge">
              <Crown size={14} />
              <span>
                {isCreateMode
                  ? (isAr ? 'صياغة تحفة نباتية جديدة' : 'New Floral Masterpiece Creation')
                  : (isAr ? 'تعديل الصياغة والوسائط الملكية' : 'Edit Royal Bouquet & Media')}
              </span>
            </div>
            <h2 className="edit-modal-title">
              {isCreateMode
                ? (isAr ? 'إضافة تصميم بوكيه ملكي جديد ✦' : 'Add New Royal Bouquet Design ✦')
                : (isAr ? `تعديل بوكيه: ${product?.name_ar}` : `Edit: ${product?.name_en || product?.name_ar}`)}
            </h2>
          </div>

          <button onClick={onClose} className="edit-close-btn" title={isAr ? 'إغلاق' : 'Close'}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="edit-modal-tabs">
          <button
            type="button"
            className={`edit-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <Crown size={16} />
            <span>{isAr ? 'البيانات والقصة' : 'Details & Story'}</span>
          </button>

          <button
            type="button"
            className={`edit-tab-btn ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <ImageIcon size={16} />
            <span>
              {isAr ? `معرض الصور والفيديو (${images.length} صور ${videoUrl ? '+ فيديو' : ''})` : `Media (${images.length})`}
            </span>
            {videoUrl && <span className="tab-video-indicator">🎬</span>}
          </button>

          <button
            type="button"
            className={`edit-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            <DollarSign size={16} />
            <span>{isAr ? 'الأسعار والمخزون' : 'Pricing & Category'}</span>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="edit-modal-form">
          <div className="edit-modal-content-scroll">
            {/* ── TAB 1: DETAILS & STORY ── */}
            {activeTab === 'details' && (
              <div className="tab-pane animate-fade-in">
                <div className="form-grid-two">
                  <div className="input-group">
                    <label>{isAr ? 'اسم البوكيه بالعربية *' : 'Bouquet Name (Arabic) *'}</label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder={isAr ? 'مثال: عروس اللؤلؤ الملكي' : 'Arabic Name'}
                      className="royal-input"
                    />
                  </div>

                  <div className="input-group">
                    <label>{isAr ? 'اسم البوكيه بالإنجليزية' : 'Bouquet Name (English)'}</label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="e.g. Royal Pearl & Lace Bridal Bouquet"
                      className="royal-input"
                    />
                  </div>
                </div>

                <div className="input-group mt-4">
                  <label>
                    {isAr
                      ? 'قصة البوكيه والوصف الملكي (عربي)'
                      : 'Bouquet Story & Description (Arabic)'}
                  </label>
                  <textarea
                    rows={4}
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    placeholder={isAr ? 'اكتب قصة ووصف جمال البوكيه والمشاعر التي يعبر عنها...' : 'Arabic description'}
                    className="royal-textarea font-amiri"
                  />
                  <small className="input-hint">
                    {isAr
                      ? 'يظهر هذا النص كقصة ملهمة في صفحة البوكيه ليعيش العميل تجربة الإهداء الفاخرة.'
                      : 'Displayed prominently on the product details page.'}
                  </small>
                </div>

                <div className="input-group mt-4">
                  <label>
                    {isAr
                      ? 'الوصف بالإنجليزية (اختياري)'
                      : 'Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="English description..."
                    className="royal-textarea"
                  />
                </div>

                <div className="input-group mt-4">
                  <label>
                    {isAr ? 'مكونات الزهور والخامات (مفصولة بفاصلة)' : 'Floral Components (comma separated)'}
                  </label>
                  <input
                    type="text"
                    value={componentsAr}
                    onChange={(e) => setComponentsAr(e.target.value)}
                    placeholder={isAr ? 'بيوني أبيض، لؤلؤ طبيعي، ياقة تول، دانتيل ملكي' : 'Peonies, Pearls, Lace wrap'}
                    className="royal-input"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 2: MEDIA (IMAGES & VIDEO) ── */}
            {activeTab === 'media' && (
              <div className="tab-pane animate-fade-in">
                {/* Image Gallery Management Section */}
                <div className="media-section-card">
                  <div className="media-section-header">
                    <div className="media-title-group">
                      <ImageIcon className="gold-icon" size={18} />
                      <h3>{isAr ? 'معرض صور البوكيه' : 'Photo Gallery'}</h3>
                      <span className="count-pill">{images.length} {isAr ? 'صور' : 'photos'}</span>
                    </div>

                    <div className="media-actions-bar">
                      <input
                        type="file"
                        ref={imageFileInputRef}
                        onChange={handleImageFilesUpload}
                        multiple
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => imageFileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="btn-upload-file"
                      >
                        <Upload size={16} />
                        <span>
                          {isUploadingImage
                            ? (isAr ? 'جاري الرفع...' : 'Uploading...')
                            : (isAr ? 'رفع صور من جهازك 📷' : 'Upload From Device')}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Add Image by URL Bar */}
                  <div className="url-add-row">
                    <div className="url-input-wrap">
                      <LinkIcon size={14} className="url-icon" />
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder={isAr ? 'أو ضع رابط صورة مباشر (URL / Google Cloud Storage)...' : 'Paste direct image URL...'}
                        className="url-input"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="btn-add-url"
                    >
                      <Plus size={15} />
                      <span>{isAr ? 'إضافة الرابط' : 'Add URL'}</span>
                    </button>
                  </div>

                  {/* Images Thumbnails Grid */}
                  {images.length === 0 ? (
                    <div
                      className="no-images-upload-card"
                      onClick={() => imageFileInputRef.current?.click()}
                    >
                      <Upload size={34} className="gold-icon mb-2" />
                      <h4>{isAr ? 'لم تقم بإضافة أي صور للبوكيه بعد' : 'No images added yet'}</h4>
                      <p>
                        {isAr
                          ? 'اضغط هنا أو على زر «رفع صور من جهازك 📷» لاختيار صور من هاتفك أو حاسوبك، أو ضع رابط صورة مباشر بالأعلى. (مطلوب صورة واحدة على الأقل لنشر البوكيه)'
                          : 'Click here or use "Upload From Device" above to select photos (at least 1 photo required).'}
                      </p>
                    </div>
                  ) : (
                    <div className="images-manager-grid">
                      {images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`image-item-card ${idx === 0 ? 'is-primary-cover' : ''}`}
                        >
                          <img src={imgUrl} alt={`bouquet-img-${idx}`} className="thumb-img" />

                          {idx === 0 && (
                            <div className="cover-badge">
                              <Crown size={12} />
                              <span>{isAr ? 'الغلاف الرئيسي' : 'Primary Cover'}</span>
                            </div>
                          )}

                          <div className="card-hover-actions">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="btn-set-cover"
                                title={isAr ? 'تعيين كغلاف رئيسي' : 'Set as primary'}
                              >
                                <Crown size={14} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="btn-delete-img"
                              title={isAr ? 'حذف هذه الصورة' : 'Delete photo'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Management Section */}
                <div className="media-section-card video-card-special mt-5">
                  <div className="media-section-header">
                    <div className="media-title-group">
                      <Film className="gold-icon" size={18} />
                      <h3>{isAr ? 'فيديو الاستعراض للبوكيه 🎬' : 'Bouquet Showcase Video'}</h3>
                      {videoUrl && <span className="video-attached-badge">{isAr ? 'مرفق فيديو نشط' : 'Video Attached'}</span>}
                    </div>

                    <div className="media-actions-bar">
                      <input
                        type="file"
                        ref={videoFileInputRef}
                        onChange={handleVideoFileUpload}
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => videoFileInputRef.current?.click()}
                        disabled={isUploadingVideo}
                        className="btn-upload-file btn-video-upload"
                      >
                        <Video size={16} />
                        <span>
                          {isUploadingVideo
                            ? (isAr ? 'جاري معالجة الفيديو...' : 'Processing...')
                            : (isAr ? 'رفع فيديو من جهازك (MP4)' : 'Upload Video File')}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Add Video by URL */}
                  <div className="url-add-row">
                    <div className="url-input-wrap">
                      <LinkIcon size={14} className="url-icon" />
                      <input
                        type="url"
                        value={newVideoInputUrl}
                        onChange={(e) => setNewVideoInputUrl(e.target.value)}
                        placeholder={isAr ? 'أو ضع رابط فيديو (YouTube / Vimeo / Cloud Storage)...' : 'Paste YouTube, Vimeo or MP4 URL...'}
                        className="url-input"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSetVideoUrl}
                      className="btn-add-url"
                    >
                      <Plus size={15} />
                      <span>{isAr ? 'تأكيد الرابط' : 'Attach Link'}</span>
                    </button>
                  </div>

                  {/* Video Live Preview if attached */}
                  {videoUrl ? (
                    <div className="video-preview-wrapper glass animate-fade-in">
                      <div className="video-player-frame">
                        {parsedVideo?.type === 'youtube' || parsedVideo?.type === 'vimeo' ? (
                          <iframe
                            src={parsedVideo.embedUrl}
                            title="Bouquet Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="preview-iframe"
                          />
                        ) : (
                          <video
                            src={parsedVideo?.embedUrl || videoUrl}
                            controls
                            className="preview-html5-video"
                          />
                        )}
                      </div>

                      <div className="video-info-footer">
                        <span className="video-url-display truncate">
                          🎬 {videoUrl.startsWith('data:') ? (isAr ? 'ملف فيديو مرفوع محلياً' : 'Local Video File') : videoUrl}
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          className="btn-remove-video"
                          title={isAr ? 'إزالة الفيديو' : 'Remove video'}
                        >
                          <Trash2 size={15} />
                          <span>{isAr ? 'إزالة الفيديو' : 'Remove'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="no-video-placeholder">
                      <Video size={36} className="placeholder-icon" />
                      <p>
                        {isAr
                          ? 'لم تقم بإرفاق فيديو لهذا البوكيه بعد. يمكنك رفع ملف فيديو MP4 أو وضع رابط YouTube ليظهر للعميل في صفحة تفاصيل البوكيه.'
                          : 'No video attached yet. Upload an MP4 video or paste a YouTube link.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 3: PRICING & CATEGORY ── */}
            {activeTab === 'pricing' && (
              <div className="tab-pane animate-fade-in">
                <div className="form-grid-two">
                  <div className="input-group">
                    <label>{isAr ? `السعر الأساسي (${currencySymbol}) *` : `Base Price (${currencySymbol}) *`}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="royal-input"
                    />
                  </div>

                  <div className="input-group">
                    <label>{isAr ? `سعر الخصم الترويجي (${currencySymbol})` : `Sale Price (${currencySymbol})`}</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder={isAr ? 'اتركه فارغاً إن لم يكن هناك خصم' : 'Leave empty for no discount'}
                      className="royal-input"
                    />
                  </div>
                </div>

                <div className="form-grid-two mt-4">
                  <div className="input-group">
                    <label>{isAr ? 'تصنيف المناسبة' : 'Category'}</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="royal-select"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {isAr ? c.name_ar : c.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label>{isAr ? 'الكمية المتوفرة حالياً' : 'Stock Quantity'}</label>
                    <input
                      type="number"
                      min="0"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      className="royal-input"
                    />
                  </div>
                </div>

                <div className="toggles-group mt-5">
                  <label className="royal-toggle-item">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                    />
                    <div className="toggle-label-wrap">
                      <span className="toggle-title">{isAr ? 'متاح للطلب الفوري' : 'Available For Immediate Order'}</span>
                      <span className="toggle-sub">
                        {isAr ? 'في حال التعطيل يظهر البوكيه كـ «نفدت الكمية»' : 'Shows as sold out when disabled'}
                      </span>
                    </div>
                  </label>

                  <label className="royal-toggle-item mt-3">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                    />
                    <div className="toggle-label-wrap">
                      <span className="toggle-title">{isAr ? 'إبراز في الصفحة الرئيسية ✦' : 'Feature on Homepage ✦'}</span>
                      <span className="toggle-sub">
                        {isAr ? 'عرض هذا البوكيه كأحد إبداعات الدار المميزة في صدارة المتجر' : 'Showcases as a flagship piece'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="edit-modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button type="submit" disabled={isSaving} className="btn-save-royal">
              <Sparkles size={18} />
              <span>
                {isSaving
                  ? (isAr ? 'جاري الحفظ...' : 'Saving...')
                  : isCreateMode
                  ? (isAr ? 'حفظ ونشر البوكيه الجديد ✦' : 'Save & Publish New Bouquet ✦')
                  : (isAr ? 'حفظ ونشر التعديلات الملكية' : 'Save & Publish Changes')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
