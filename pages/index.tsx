import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Canvas from "./components/Canvas";

const Home: NextPage = () => {
  return <Canvas />
};

export default Home;
