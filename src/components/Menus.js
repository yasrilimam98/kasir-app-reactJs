import React from "react";
import { Col, Card } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";

const Menus = ({ produk, masukKeranjang }) => {
  return (
    <Col md={4} xs={6} className="mb-4">
      <Card className="shadow" onClick={() => masukKeranjang(produk)}>
        <Card.Img
          variant="top"
          src={
            "assets/images/" +
            produk.category.nama.toLowerCase() +
            "/" +
            produk.gambar
          }
        />
        <Card.Body>
          <Card.Title>
            {produk.nama} <strong>({produk.kode})</strong>
          </Card.Title>
          <Card.Text>Rp. {numberWithCommas(produk.harga)}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Menus;
