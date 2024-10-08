import { RootState } from '@/app/store';
import { createSuperAdminProfile } from '@/config/service/profile';
import { setToken, TokenState } from '@/config/slice/token/slice';
import { SellerAccountStatus, SellerGender } from '@/model/enum';
import { WEB_ROUTER } from '@/utils/web_router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Define types for form data and error messages
export interface SuperAdminCreateForm {
  displayName: string;
  firstName: string;
  lastName: string;
  birth: string;
  gender: SellerGender;
  email: string;
  phoneNumber: string;
}

interface FormErrors {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  birth?: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
}

const Profile = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const navigate = useNavigate()
  const token : TokenState= useSelector((state: RootState) => state.token); // Get token from Redux state
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<SuperAdminCreateForm>({
    displayName: '',
    firstName: '',
    lastName: '',
    birth: '',
    gender: SellerGender.MALE,
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {        
    if (token.status != SellerAccountStatus.NEW) {
        navigate(WEB_ROUTER.HOME);
    }
}, [])

  const [errors, setErrors] = useState<FormErrors>({}); // State for error messages

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.displayName) newErrors.displayName = t('message.required', { field: t('profile.displayName') });
    if (!formData.firstName) newErrors.firstName = t('message.required', { field: t('profile.firstName') });
    if (!formData.lastName) newErrors.lastName = t('message.required', { field: t('profile.lastName') });
    if (!formData.birth) newErrors.birth = t('message.required', { field: t('profile.birth') });
    if (!formData.gender) newErrors.gender = t('message.required', { field: t('profile.gender') });
    if (!formData.email) newErrors.email = t('message.required', { field: t('profile.email') });
    if (!formData.phoneNumber) newErrors.phoneNumber = t('message.required', { field: t('profile.phoneNumber') });
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    try{
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
      } else {
        setErrors({});
        await createSuperAdminProfile(formData);
        dispatch(setToken({...token, status : SellerAccountStatus.ACTIVE}))
        navigate(WEB_ROUTER.HOME);
      }
    }catch(error : any) {
      toast.error(t(`message.${error.message}`));
    }
  };


  return (
    <div className="join join-vertical max-w-xl mx-auto p-4 md:p-6 lg:p-8 shadow-xl">
      <h1 className="text-center text-2xl font-bold mb-4">{t('profile.title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate={true}>
        <div>
          <input
            type="text"
            name="displayName"
            className={`input w-full ${errors.displayName ? 'input-error' : 'input-bordered'}`}
            value={formData.displayName}
            onChange={handleChange}
            placeholder={t('profile.displayName')}
            required
          />
          {errors.displayName && <p className="mt-2 text-sm text-error">{errors.displayName}</p>}
        </div>
        <div className='join join-horizontal'>
          <div>
            <input
              type="text"
              name="firstName"
              className={`input w-full ${errors.firstName ? 'input-error' : 'input-bordered'}`}
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t('profile.firstName')}
              required
            />
            {errors.firstName && <p className="mt-2 text-sm text-error">{errors.firstName}</p>}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              className={`input w-full ${errors.lastName ? 'input-error' : 'input-bordered'}`}
              value={formData.lastName}
              onChange={handleChange}
              placeholder={t('profile.lastName')}
              required
            />
            {errors.lastName && <p className="mt-2 text-sm text-error">{errors.lastName}</p>}
          </div>
        </div>
        <div>
          <label className="label">{t('profile.birth')}</label>
          <input
            type="date"
            name="birth"
            className={`input w-full ${errors.birth ? 'input-error' : 'input-bordered'}`}
            value={formData.birth}
            onChange={handleChange}
            required
          />
          {errors.birth && <p className="mt-2 text-sm text-error">{errors.birth}</p>}
        </div>
        <div>
          <label className="label">{t('profile.gender')}</label>
          <select
            name="gender"
            className={`select w-full ${errors.gender ? 'input-error' : 'input-bordered'}`}
            value={formData.gender}
            onChange={handleChange}
          >
            <option value={SellerGender.MALE}>{t('profile.genderMale')}</option>
            <option value={SellerGender.FEMALE}>{t('profile.genderFemale')}</option>
            <option value={SellerGender.OTHER}>{t('profile.genderOther')}</option>
          </select>
        </div>
        <div>
          <label className="label">{t('profile.email')}</label>
          <input
            type="email"
            name="email"
            className={`input w-full ${errors.email ? 'input-error' : 'input-bordered'}`}
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="mt-2 text-sm text-error">{errors.email}</p>}
        </div>
        <div>
          <label className="label">{t('profile.phoneNumber')}</label>
          <input
            type="tel"
            name="phoneNumber"
            className={`input w-full ${errors.phoneNumber ? 'input-error' : 'input-bordered'}`}
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {errors.phoneNumber && <p className="mt-2 text-sm text-error">{errors.phoneNumber}</p>}
        </div>
        <button type="submit" className="btn btn-primary w-full mt-4">
          {t('profile.submit')}
        </button>
      </form>
    </div>
  );
};

export default Profile;
