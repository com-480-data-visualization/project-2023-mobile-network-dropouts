import { EloGamesDistributionViz } from "../d3_visualizations/elo_games_distribution_viz";
import { D3VizAndChessboardSplitScreen } from "./viz_and_chess_wrapper";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Title = () => {
  return (
    <>
      <div
        style={{
          paddingTop: "0px",
          paddingBottom: "20px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "30px",
            color: "#333333",
            fontFamily: "georgia",
            alignSelf: "center",
          }}
        >
          ELO Of Players On Lichess
        </h1>
        <p
          style={{
            width: "1000px",
            marginTop: "-10px",
            fontSize: "20px",
            color: "#555555",
            alignSelf: "center",
            fontFamily: "Trebuchet MS",
          }}
        >
          The level of a player in chess is measured my his/her ELO. You can see
          the typical ELO of players, together with a game played by them in the
          graph below.
        </p>
      </div>
    </>
  );
};

const Content = () => {
  const s = [
    "## Introduction",
    "**TODO**",
    //   "_*Chess Visualizer*_ is a tool for visualizing data about chess games. This data includes:",
    //   " * The average ELO of online players.\n * The average length of games (by number of moves).\n" +
    //     " * Various statistics generated independently for multiple _ELO ranges_ (i.e. various skill level).",
    //   "## Who is part of the target audience?",
    //   "**Short answer:** Anybody.",
    //   "**Long answer:** Someone looking to improve their chess level, by analysing how players of various skills tackle games, including data such as the most frequent openings played for each skill level, sample games visualized on an interactive board, or how games played between players of slightly different skill usually end.",
    //   "## Origin of the data",
    //   "All of the analized data comes from [lichess](https://lichess.org), a free-to-play, open-source and multiplayer chess website, where users of any skill from all around the world play together.",
    //   "In April 2023 alone, `101,706,224` games were played on _lichess_ (or roughly `40` new games per second), all of which are publicly available to download on their [database page](https://database.lichess.org/).",
  ];

  return (
    <div className="react-markdown">
      {s.map((el) => (
        <ReactMarkdown remarkPlugins={[remarkGfm]} children={el} />
      ))}
    </div>
  );
};

export const ELO = () => {
  return (
    <div>
      <Title />
      <D3VizAndChessboardSplitScreen d3Viz={EloGamesDistributionViz} />
      <div
        style={{
          paddingLeft: "20%",
          paddingRight: "20%",
          marginBottom: "300px",
        }}
      >
        <Content />
      </div>
    </div>
  );
};
