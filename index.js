// đường dẫn của api
const baseURL = "https://provinces.open-api.vn/api";

class Http {
  async get(url) {
    let response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }
}

class Store {
  constructor() {
    this.http = new Http(); // store lên server lấy dữ kiện và chắc chắn có hàm get
  }

  getProvinces(code = "") {
    // nếu gọi hàm getProvinces này mà rỗng thì lấy hết
    return this.http.get(`${baseURL}/p/${code}`); // gọi hàm get của class Http
  }

  async getDistricts(provinceCode) {
    let provinceInfor = await this.http.get(
      `${baseURL}/p/${provinceCode}/?depth=2`
    );
    return provinceInfor.districts;
  }

  async getWards(districtCode) {
    let districtInfor = await this.http.get(
      `${baseURL}/d/${districtCode}/?depth=2`
    );
    return districtInfor.wards;
  }
}

class RenderUI {
  renderProvinces(provinces) {
    let htmlContent = "";
    provinces.forEach((provinceItem) => {
      const { name, code } = provinceItem;
      htmlContent += `<option value="${code}">${name}</option>`;
    });
    // nhét vào select của province
    document.querySelector("#province").innerHTML = htmlContent;
  }

  renderDistricts(districts) {
    let htmlContent = "";
    districts.forEach((districtItem) => {
      const { name, code } = districtItem;
      htmlContent += `<option value="${code}">${name}</option>`;
    });
    // nhét vào select của province
    document.querySelector("#district").innerHTML = htmlContent;
  }

  renderWards(wards) {
    let htmlContent = "";
    wards.forEach((wardItem) => {
      const { name, code } = wardItem;
      htmlContent += `<option value="${code}">${name}</option>`;
    });
    // nhét vào select của province
    document.querySelector("#ward").innerHTML = htmlContent;
  }

  renderInformation(information) {
    const { address, province, district, ward } = information;
    let htmlContent = `${address}, ${ward}, ${district}, ${province}`;
    document.querySelector("#information").innerHTML = htmlContent;
  }
}

// sự kiện load file
document.addEventListener("DOMContentLoaded", async (event) => {
  let store = new Store();
  let ui = new RenderUI();

  let provinces = await store.getProvinces();
  ui.renderProvinces(provinces);

  let provinceCode = document.querySelector("#province").value;
  let districts = await store.getDistricts(provinceCode);
  ui.renderDistricts(districts);

  let districtCode = document.querySelector("#district").value;
  let wards = await store.getWards(districtCode);
  ui.renderWards(wards);
});
// sự kiện thay đổi thành phố
document
  .querySelector("#province")
  .addEventListener("change", async (event) => {
    let store = new Store();
    let ui = new RenderUI();

    let provinceCode = document.querySelector("#province").value;
    let districts = await store.getDistricts(provinceCode);
    ui.renderDistricts(districts);

    let districtCode = document.querySelector("#district").value;
    let wards = await store.getWards(districtCode);
    ui.renderWards(wards);
  });
// sự kiện thay đổi quận huyện
document
  .querySelector("#district")
  .addEventListener("change", async (event) => {
    let store = new Store();
    let ui = new RenderUI();

    let districtCode = document.querySelector("#district").value;
    let wards = await store.getWards(districtCode);
    ui.renderWards(wards);
  });
// sự kiện đặt hàng và hiển thị thông tin địa chỉ ra màn hình
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  let province = document.querySelector("#province option:checked").innerHTML;
  let district = document.querySelector("#district option:checked").innerHTML;
  let ward = document.querySelector("#ward option:checked").innerHTML;
  let address = document.querySelector("#address").value;

  let information = { province, district, ward, address };
  RenderUI.prototype.renderInformation(information);
});
