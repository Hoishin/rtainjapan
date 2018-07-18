import React from 'react';
import styled from 'styled-components';
import cloneDeep from 'lodash/cloneDeep';

// MUI Core
import {Color} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import purple from '@material-ui/core/colors/purple';
import grey from '@material-ui/core/colors/grey';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Refresh from '@material-ui/icons/Refresh';
import ModeEdit from '@material-ui/icons/ModeEdit';

import {TimeObject, TimerState} from '../../../lib/time-object';
import {
	stopwatchRep,
	currentRunRep,
	checklistCompleteRep,
} from '../../replicants';

const Container = styled.div`
	margin: 0 16px;
	font-weight: 700;
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-rows: 105px 1fr;
	grid-template-areas: 'timer ctrls' 'runners runners';
	justify-items: center;
	align-items: center;
`;

const Timer = styled.div`
	grid-area: timer;
	padding: 0 16px;
	font-size: 55px;
`;

const CtrlsContainer = styled.div`
	grid-area: ctrls;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 8px;
	justify-items: center;
	align-items: center;
`;

const customPrimaryColorTheme = (color: Color) =>
	createMuiTheme({
		props: {
			MuiButton: {
				size: 'large',
				fullWidth: true,
				variant: 'raised',
				color: 'primary',
			},
		},
		palette: {
			primary: color,
		},
	});

export class Timekeeper extends React.Component<
	{},
	{timer: TimeObject; runners: (string | null)[]; checklistComplete: boolean}
> {
	constructor(props: {}) {
		super(props);
		this.state = {
			timer: new TimeObject(0),
			runners: [],
			checklistComplete: false,
		};
		stopwatchRep.on('change', newVal => {
			this.setState({
				...this.state,
				timer: cloneDeep(newVal),
			});
		});
		currentRunRep.on('change', newVal => {
			const runners: (string | null)[] = [null, null, null, null];
			if (newVal.runners) {
				newVal.runners.slice(0, 4).forEach((runner, index) => {
					if (runner) {
						runners[index] = runner.name || '';
					}
				});
			}
			this.setState({
				...this.state,
				runners,
			});
		});
		checklistCompleteRep.on('change', newVal => {
			if (newVal === this.state.checklistComplete) {
				return;
			}
			this.setState({
				...this.state,
				checklistComplete: newVal,
			});
		});
	}

	render() {
		return (
			<Container>
				<Timer>{this.state.timer.formatted}</Timer>
				<CtrlsContainer>
					<MuiThemeProvider theme={customPrimaryColorTheme(green)}>
						<Button>
							<PlayArrow />開始
						</Button>
					</MuiThemeProvider>
					<MuiThemeProvider theme={customPrimaryColorTheme(orange)}>
						<Button>
							<Pause />停止
						</Button>
					</MuiThemeProvider>
					<MuiThemeProvider theme={customPrimaryColorTheme(purple)}>
						<Button>
							<Refresh />リセット
						</Button>
					</MuiThemeProvider>
					<MuiThemeProvider theme={customPrimaryColorTheme(grey)}>
						<Button>
							<ModeEdit />編集
						</Button>
					</MuiThemeProvider>
				</CtrlsContainer>
				<div>hoge</div>
				<div>hoge</div>
				<div>hoge</div>
				<div>hoge</div>
			</Container>
		);
	}

	private readonly paused = () =>
		this.state.timer.timerState === TimerState.Stopped &&
		this.state.timer.raw > 0;
}
