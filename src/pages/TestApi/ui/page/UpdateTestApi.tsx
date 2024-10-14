import { WEB_ROUTER } from '@/utils/web_router';
import { JsonInfo, PageLayout, TreeApp, TreeKeyValue } from '@/widgets';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TestApiUpdate } from '../../model/type';
import { useNavigate, useParams } from 'react-router-dom';
import { Project } from '@/pages/Project';
import { getProjects } from '@/config/service';
import { toast } from 'react-toastify';
import { getTestApiById, updateTestApi } from '../../service/TestFieldService';
import { getTestFields, TestField } from '@/pages/TestField';

const UpdateTestApi = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testFields, setTestField] = useState<TestField[]>([]);
  const [form, setForm] = useState<TestApiUpdate>({
    id: 0,
    apiName: '',
    path: '',
    projectId: 0,
    description: '',
    method: 'GET',
    param: [],
    header: [],
    body: undefined
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

  const fetchTestFeilds = async (name?: string) => {
    try {
      const filter = {
        fieldName: name,
        page: 0,
        size: 10,
        sort: "createdAt,desc"
      };
      const response = await getTestFields(filter);
      setTestField(response.data);
    } catch (error: any) {
      toast.error(t(`message.${error.message}`));
    }
  };

  const fetchTestApi = async () => {
    setLoading(true);
    try {
      const response = await getTestApiById(Number(id));
      setForm({ ...response.data, projectId: response.data.project.id });
    } catch (error: any) {
      toast.error(t(`message.${error.message}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTestApi();
    fetchTestFeilds();
  }, []);

  const handleSetBody = (body?: JsonInfo) => {
    setForm(prev => ({
      ...prev,
      body: body
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'projectId' ? Number(value) : value
    }));
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateTestApi(Number(id), form);
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

        <div className="flex space-x-4">
          <div className="flex-2 form-control">
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

          <div className="flex-1 form-control">
            <label className="label">
              <span className="label-text">{t('text.testApi.path')}</span>
            </label>
            <input
              name="path"
              value={form.path}
              onChange={handleInputChange}
              className="input input-bordered"
            />
          </div>
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

        {/* Headers & Params Section */}
        <div className="flex space-x-4">
          {/* Headers Section */}
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">{t('text.testApi.headers')}</span>
            </label>
            <TreeKeyValue
              items={form.header}
              onChange={(newHeaders) => setForm(prev => ({ ...prev, header: newHeaders }))}
              options={testFields.map(field => ({ label: field.fieldName, value: field.id }))}
              onInputChange={fetchTestFeilds}
            />
          </div>

          {/* Params Section */}
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">{t('text.testApi.params')}</span>
            </label>
            <TreeKeyValue
              items={form.param}
              onChange={(newParams) => setForm(prev => ({ ...prev, param: newParams }))}
              options={testFields.map(field => ({ label: field.fieldName, value: field.id }))}
              onInputChange={fetchTestFeilds}
            />
          </div>
        </div>

        <div className="form-control">
          <TreeApp body={form.body}
            setBody={handleSetBody}
            testFields={testFields}
            fetchTestFeilds={fetchTestFeilds} />
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
