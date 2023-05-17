import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";

import { IMyBeer } from "../interfaces/Beer.interface";
import { generateUUID } from "../utils";

interface AddBeerModalProps {
  closeModal: () => void;
  handleSubmit: (formData: IMyBeer) => void;
}

const AddBeerModal: React.FC<AddBeerModalProps> = ({
  handleSubmit,
  closeModal
}) => {
  const formik = useFormik({
    initialValues: {
      id: generateUUID(),
      name: '',
      genere: '',
      image_url: '/assets/houzz-beer.png',
      ingredients: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Beer image is required'),
      genere: Yup.string().required('Beer genere is required'),
      description: Yup.string().required('Beer description is required'),
      ingredients: Yup.string().required('Beer ingredients are required')
    }),
    onSubmit: async (values: IMyBeer) => {
      handleSubmit(values);
    }
  });

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Add New Beer</h5>
            <button type="button" className="btn-close" onClick={closeModal} />
          </div>
          <div className="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <div className="img-thumbnail text-center img-wrapper">
                  <img
                    src="/assets/houzz-beer.png"
                    alt="Houzz Beer"
                    style={{ height: "100px" }}
                  />
                </div>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  className="form-control"
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-danger">{formik.errors.name}</div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  id="genere"
                  placeholder="Genere"
                  className="form-control"
                  {...formik.getFieldProps("genere")}
                />
                {formik.touched.genere && formik.errors.genere && (
                  <div className="text-danger">{formik.errors.genere}</div>
                )}
              </div>
              <div className="mb-3">
                <textarea
                  id="description"
                  placeholder="Description"
                  className="form-control"
                  rows={3}
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-danger">{formik.errors.description}</div>
                )}
              </div>
              <div className="mb-3">
                <textarea
                  id="ingredients"
                  placeholder="Ingredients"
                  className="form-control"
                  rows={3}
                  {...formik.getFieldProps("ingredients")}
                />
                {formik.touched.ingredients && formik.errors.ingredients && (
                  <div className="text-danger">{formik.errors.ingredients}</div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Beer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBeerModal;
