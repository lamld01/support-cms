import { WEB_ROUTER } from '@/utils/web_router';
import { PageLayout } from '@/widgets';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, TestApiCreate, TestApiUpdate } from '../../model/type';
import { useNavigate, useParams } from 'react-router-dom';
import { Project } from '@/pages/Project';
import { getProjects } from '@/config/service';
import { toast } from 'react-toastify';
import { createTestApi, getTestApiById, updateTestApi } from '../../service/TestFieldService';
import { TrashIcon } from '@heroicons/react/24/outline';
import { filterEmptyKeys } from '@/utils/helper';

const UpdateTestApi = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<TestApiUpdate>({
    id: 0,
    apiName: '',
    projectId: 0,
    description: '',
    method: 'GET',
    param: {},
    header: {},
    body: ''
  });

  const fetchProjects = async (name?: string) => {
    try {
      const filter = {
        projectName: name,
        page: 0,
        size: 10,
        sort: "createdAt,desc"
      };
      const response = await getProjects(filter);
      setProjects(response.data);
    } catch (error: any) {
      toast.error(t(`message.${error.message}`));
    }
  };

  const fetchTestApi = async () => {
    setLoading(true);
    try {
      const response = await getTestApiById(Number(id));
      setForm(response.data);
    } catch (error: any) {
      toast.error(t(`message.${error.message}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTestApi();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'projectId' ? Number(value) : value
    }));
  };

  const handleKeyValueChange = (type: 'param' | 'header', key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value // Ensure value is a string
      }
    }));
  };

  const handleAddKeyValue = (type: 'param' | 'header') => {
    setForm(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        '': '' // Add a new empty key-value pair
      }
    }));
  };

  const handleRemoveKeyValue = (type: 'param' | 'header', key: string) => {
    const newKeyValue = { ...form[type] };
    delete newKeyValue[key]; // Remove the specified key
    setForm(prev => ({
      ...prev,
      [type]: newKeyValue // Update state
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const filteredParams = filterEmptyKeys(form.param);
      const filteredHeaders = filterEmptyKeys(form.header);
      await updateTestApi(Number(id), { ...form, param: filteredParams, header: filteredHeaders });
      navigate(WEB_ROUTER.LIST_TEST_API.ROOT);
    } catch (error: any) {
      toast.error(t(`message.${error.message}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: t('breadcrumbs.home'), url: '/' },
        { label: t('breadcrumbs.listTestApis'), url: WEB_ROUTER.LIST_TEST_API.ROOT },
        { label: t('breadcrumbs.testApi.edit'), url: WEB_ROUTER.LIST_TEST_API.UPDATE.ROOT, active: true },
      ]}
      loading={loading}
      title={t('breadcrumbs.testApi.edit')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">{t('text.testApi.apiName')}</span>
            </label>
            <input
              type="text"
              name="apiName"
              value={form.apiName}
              onChange={handleInputChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">{t('text.testApi.method')}</span>
            </label>
            <select
              name="method"
              value={form.method}
              onChange={handleInputChange}
              className="select select-bordered"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('text.testApi.project')}</span>
          </label>
          <select
            name="projectId"
            value={form.projectId}
            onChange={handleInputChange}
            required
            className="select select-bordered"
          >
            <option value="" disabled>Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>

        {/* Description Section */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('text.testApi.description')}</span>
          </label>
          <textarea
            name="body"
            value={form.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered"
          />
        </div>

        {/* Params and Headers Section */}
        <div className="flex space-x-4">
          {/* Params Section */}
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">{t('text.testApi.params')}</span>
            </label>
            {Object.entries(form.param).map(([key, value]) => (
              <div key={key} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={key} // This is a string
                  onChange={(e) => handleKeyValueChange('param', e.target.value, String(value))} // Make sure the key is a string
                  className="input input-bordered flex-1"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={value || ''} // Ensure this is a string, default to empty
                  onChange={(e) => handleKeyValueChange('param', key, e.target.value)} // Ensure e.target.value is a string
                  className="input input-bordered flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveKeyValue('param', key)}
                  className="btn btn-error btn-xs h-full flex items-center justify-center"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddKeyValue('param')}
              className="btn btn-secondary btn-xs"
            >
              {t('common.button.add')}
            </button>
          </div>

          {/* Headers Section */}
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">{t('text.testApi.headers')}</span>
            </label>
            {Object.entries(form.header).map(([key, value]) => (
              <div key={key} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={key} // This is a string
                  onChange={(e) => handleKeyValueChange('header', e.target.value, String(value))} // Ensure the key is a string
                  className="input input-bordered flex-1"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={value || ''} // Ensure this is a string, default to empty
                  onChange={(e) => handleKeyValueChange('header', key, e.target.value)} // Ensure e.target.value is a string
                  className="input input-bordered flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveKeyValue('header', key)}
                  className="btn btn-error btn-xs h-full flex items-center justify-center"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddKeyValue('header')}
              className="btn btn-secondary btn-xs"
            >
              {t('common.button.add')}
            </button>
          </div>
        </div>

        {/* Body Section */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('text.testApi.body')}</span>
          </label>
          <textarea
            name="body"
            value={form.body}
            onChange={handleInputChange}
            className="textarea textarea-bordered"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            {t('common.button.update')}
          </button>
        </div>
      </form>
    </PageLayout>
  );
};

export default UpdateTestApi;
