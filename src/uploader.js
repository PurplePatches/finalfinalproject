import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploaderVisible: true
        };
        this.saveInput = this.saveInput.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.close = this.close.bind(this);
    }
    saveInput(e) {
        console.log(e.target.value);
        this.setState({
            file: e.target.files[0]
        });
    }
    uploadImage(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios.post("/upload", formData).then(({ data }) => {
            // console.log("data", data);
            this.props.setUrl(data.url);
        });
    }

    close() {
        this.setState({ isUploaderVisible: false });
    }

    render() {
        return (
            <div className="modal">
                <div className="overlay">
                    <div className="modal_content">
                        <input
                            id="upload"
                            type="file"
                            accept="image/*"
                            name="file"
                            title=" "
                            onChange={this.saveInput}
                        />
                        <div className="buttonsWrapper">
                            <button
                                className="uploadImage"
                                onClick={e => this.uploadImage(e)}
                            >
                                Save
                            </button>
                            <button className="closeModal" onClick={this.close}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
