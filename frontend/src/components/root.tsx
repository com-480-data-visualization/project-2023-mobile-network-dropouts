import { Alignment, Button, Classes, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from '@blueprintjs/core';
import { useState } from 'react';
import { HeatMapViz } from '../d3_visualizations/heatmap_viz';
import { EloGamesDistributionViz } from '../d3_visualizations/elo_games_distribution_viz';
import { D3VizAndChessboardSplitScreen } from './viz_and_chess_wrapper';
import { AverageGameLengthHistViz } from '../d3_visualizations/average_game_length_hist_viz';
import SideBySideVizWrapper from './side_by_side_viz_wrapper';
import { NrMovesPerGamePerEloBucket } from '../d3_visualizations/nr_moves_per_game_per_elo_bucket';
import { EloBucketsViewer } from './elo_buckets_viewer';

function Root() {
    // stores the view we want to display
    let [view, setView] = useState("elo_games_distribution");

    return (
        <div style={{ "width": "100%" }}>
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>Chess Visualizer</NavbarHeading>
                    <NavbarDivider />
                    <Button
                        className={Classes.MINIMAL}
                        icon="home"
                        text="ELO"
                        onClick={() => setView("elo_games_distribution")}
                        active={view === "elo_games_distribution"}
                    />
                    <Button
                        className={Classes.MINIMAL}
                        icon="model" text="Average Length"
                        onClick={() => setView("average_game_length_his_viz")}
                        active={view === "average_game_length_his_viz"}
                    />
                    <Button
                        className={Classes.MINIMAL}
                        icon="comparison"
                        text="ELO Specifics"
                        onClick={() => setView("elo-specifics")}
                        active={view === "elo-specifics"}
                    />
                </NavbarGroup>
            </Navbar>
            <div style={{ "width": "100%", "padding": "30px" }}>
                {/* We display the view we are interested in. */}
                {view === "elo_games_distribution" && <D3VizAndChessboardSplitScreen d3Viz={EloGamesDistributionViz} />}
                {view === "average_game_length_his_viz" &&
                    <SideBySideVizWrapper
                        D3RendererMasterViz={AverageGameLengthHistViz}
                        D3RendererSlaveViz={NrMovesPerGamePerEloBucket} />}
                {view === "elo-specifics" && <EloBucketsViewer />}
            </div>
        </div>
    );
}

export default Root;
