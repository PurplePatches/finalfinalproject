import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.saveInput = this.saveInput.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
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

    render() {
        return (
            <div className="imageModal">
                <input
                    type="file"
                    accept="image/*"
                    name="file"
                    title=" "
                    onChange={this.saveInput}
                />
                <button
                    className="uploadImage"
                    onClick={e => this.uploadImage(e)}
                >
                    Save
                </button>
            </div>
        );
    }
}
