import React, { Component } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { Hasil, ListCategories, Menus } from "../components";
import { API_URL } from "../utils/constants";
import axios from "axios";
import swal from "sweetalert";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: [],
      // buat state categori yang dipilih default
      categoriYangDipilih: "Makanan",
      keranjangs: [],
    };
  }

  componentDidMount() {
    axios
      .get(API_URL + "products?category.nama=" + this.state.categoriYangDipilih)
      .then((res) => {
        const menus = res.data;
        this.setState({ menus });
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
    // buat get kerjang dan state keranjang untuk passing ke hasil
    axios
      .get(API_URL + "keranjangs")
      .then((res) => {
        const keranjangs = res.data;
        this.setState({ keranjangs });
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }

  // agar ngecek api terus menerus secara realtime
  componentDidUpdate(prevState) {
    if (this.state.keranjangs !== prevState.keranjangs) {
      axios
        .get(API_URL + "keranjangs")
        .then((res) => {
          const keranjangs = res.data;
          this.setState({ keranjangs });
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    }
  }

  // change category di oper ke list categories
  changeCategory = (value) => {
    this.setState({
      categoriYangDipilih: value,
      menus: [],
    });
    axios
      .get(API_URL + "products?category.nama=" + value)
      .then((res) => {
        const menus = res.data;
        this.setState({ menus });
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  // buat metod
  masukKeranjang = (value) => {
    console.log("Menu :", value);
    // buat tidak bertambah jika produk yang sama di keranjang dengan get data
    axios
      .get(API_URL + "keranjangs?product.id=" + value.id)
      .then((res) => {
        if (res.data.length === 0) {
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product: value,
          };
          axios
            .post(API_URL + "keranjangs", keranjang)
            .then((res) => {
              swal({
                title: "Berhasil",
                text:
                  "Menu berhasil ditambahkan ke keranjang" +
                  keranjang.product.nama,
                icon: "success",
                button: false,
              });
            })
            .catch((error) => {
              console.log("Error: ", error);
            });
        } else {
          const keranjang = {
            jumlah: res.data[0].jumlah + 1,
            total_harga: res.data[0].total_harga + value.harga,
            product: value,
          };
          // update jika berhasil dengan put
          axios
            .put(API_URL + "keranjangs/" + res.data[0].id, keranjang)
            .then((res) => {
              swal({
                title: "Berhasil",
                text:
                  "Menu berhasil ditambahkan ke keranjang" +
                  keranjang.product.nama,
                icon: "success",
                button: false,
                timer: 1000,
              });
            })
            .catch((error) => {
              console.log("Error: ", error);
            });
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  render() {
    const { menus, categoriYangDipilih, keranjangs } = this.state;
    return (
      <div className="mt-3">
        <Container fluid>
          <Row>
            {/* oper arrow function change categori to list categori dan state categoriyangdipilih */}
            <ListCategories
              changeCategory={this.changeCategory}
              categoriYangDipilih={categoriYangDipilih}
            />
            <Col>
              <h4>
                <strong>Daftar Produk</strong>
              </h4>
              <hr />
              <Row>
                {/* Jika menus itu ada maka di mapingkan menggunakan && */}
                {menus &&
                  menus.map((produk) => (
                    <Menus
                      key={produk.id}
                      produk={produk}
                      masukKeranjang={this.masukKeranjang}
                    />
                  ))}
              </Row>
            </Col>
            <Hasil keranjangs={keranjangs} />
          </Row>
        </Container>
      </div>
    );
  }
}
