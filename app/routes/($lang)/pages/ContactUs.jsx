import {useState} from 'react';

export function ContactUs() {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const fileList = event.target.files;

    const uploadedFiles = Array.from(fileList).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setFiles([...files, ...uploadedFiles]);
  };

  const handleRemoveFile = (file) => {
    const updatedFiles = files.filter((uploadedFile) => uploadedFile !== file);
    setFiles(updatedFiles);
  };

  const submitHandle = (e) => {
    e.preventDefault();
    console.log('form submit');
  };
  return (
    <div>
      <div className="block w-full my-10 contact_section">
        <div className="page-width ">
          <div className="w-full max-w-xl mx-auto bg-white border border-solid rounded-md contact_border ">
            <h1 className="px-4 py-2 m-0 text-xl font-medium tracking-wider capitalize border-b border-solid contact_border text-color">
              Contact Us
            </h1>

            <div className="px-4 pt-4">
              <form
                action="https://submit.jotform.com/submit/231153833566457"
                method="post"
                enctype="multipart/form-data"
                name="form_231153833566457"
                id="231153833566457"
                accept-charset="utf-8"
                autocomplete="on"
                className="!h-auto"
                // onSubmit={submitHandle}
              >
                <input type="hidden" name="formID" value="231153833566457" />
                <input type="hidden" id="JWTContainer" value="" />
                <input type="hidden" id="cardinalOrderNumber" value="" />
                <div className="mb-3 contact-form-field">
                  <label
                    htmlFor="name"
                    className="block mb-1 text-md md:text-lg font-medium text-color"
                  >
                    Full name <span className="sterik_color">* </span>
                  </label>
                  <input
                    id="input_8"
                    name="q8_fullName"
                    required
                    data-type="input-textbox"
                    data-component="textbox"
                    className="w-full px-3 py-2 text-sm border border-solid rounded-md contact_border focus:outline-none"
                  />
                </div>
                <div className="mb-3 contact-form-field">
                  <label
                    htmlFor="email"
                    className="block mb-1 text-md md:text-lg font-medium text-color"
                  >
                    Email <span className="sterik_color">* </span>
                  </label>
                  <input
                    type="email"
                    id="input_7"
                    name="q7_email"
                    required
                    data-component="email"
                    className="w-full px-3 py-2 text-sm border border-solid rounded-md contact_border focus:outline-none"
                  />
                </div>
                <div className="mb-3 contact-form-field">
                  <label
                    htmlFor="subject"
                    className="block mb-1 text-md md:text-lg font-medium text-color"
                  >
                    Subject <span className="sterik_color">* </span>
                  </label>
                  <input
                    type="text"
                    id="input_11"
                    name="q11_typeA"
                    data-type="input-textbox"
                    required
                    data-component="textbox"
                    className="w-full px-3 py-2 text-sm border border-solid rounded-md contact_border focus:outline-none"
                  />
                </div>
                <div className="mb-4 contact-form-field">
                  <label
                    htmlFor="message"
                    className="block mb-1 text-md md:text-lg font-medium text-color"
                  >
                    Message <span className="sterik_color">* </span>
                  </label>

                  <textarea
                    rows="3"
                    id="input_4"
                    name="q4_message4"
                    required
                    data-component="textarea"
                    placeholder="Write your message"
                    className="w-full px-3 py-2 text-sm border border-solid rounded-md contact_border focus:outline-none"
                  ></textarea>
                </div>

                <div
                  className={`relative flex items-center justify-center h-12 border border-solid rounded-md attach_bg contact_border ${
                    files?.length >= 10 ? 'opacity-60' : 'opacity-100'
                  }`}
                >
                  <div className="absolute">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 5v12c0 2.757-2.243 5-5 5s-5-2.243-5-5v-12c0-1.654 1.346-3 3-3s3 1.346 3 3v9c0 .551-.449 1-1 1s-1-.449-1-1v-8h-2v8c0 1.657 1.343 3 3 3s3-1.343 3-3v-9c0-2.761-2.239-5-5-5s-5 2.239-5 5v12c0 3.866 3.134 7 7 7s7-3.134 7-7v-12h-2z" />
                      </svg>
                      <span className="block text-md font-normal text-color attch_file ">
                        Attach Files
                      </span>
                    </div>
                  </div>{' '}
                  <input
                    type="file"
                    id="input_10"
                    name="q10_input10[]"
                    multiple=""
                    data-component="fileupload"
                    className={`w-full h-full opacity-0 ${
                      files?.length >= 10
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                    data-imagevalidate="yes"
                    data-file-maxsize="10854"
                    data-file-minsize="0"
                    data-file-limit="10"
                    disabled={files?.length >= 10}
                    onChange={handleFileUpload}
                  />
                </div>
                <div className=" block w-full mb-6 btm_attch text-smm">
                  Attach up to 10 files. Max file size: 10 MB.
                </div>
                <div className="mb-6">
                  {files?.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between mb-2"
                    >
                      <div className="flex items-center">
                        <img
                          className="w-5 h-5 mr-2"
                          src={file.url}
                          alt={file.name}
                        />

                        <span className="block text-sm font-normal text-color">
                          {file.name}
                        </span>
                      </div>
                      <span
                        className="block text-sm font-normal text-color cursor-pointer hover:underline"
                        onClick={() => handleRemoveFile(file)}
                      >
                        Remove
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <button
                    id="input_2"
                    type="submit"
                    data-component="button"
                    className="w-full btn focus:outline-none"
                  >
                    Send
                  </button>
                </div>
                <p
                  className="text-base text-center text-gray-400"
                  id="result"
                ></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
