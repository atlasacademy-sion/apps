import { faBook, faDragon, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Col, Row, Tab, Table, Tabs } from "react-bootstrap";
import { WithTranslation, useTranslation, withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";

import { Bgm, CondType, Event, Gift, Item, Quest, Region, War } from "@atlasacademy/api-connector";

import Api from "../Api";
import CollapsibleContent from "../Component/CollapsibleContent";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import BgmDescriptor from "../Descriptor/BgmDescriptor";
import EntityReferenceDescriptor from "../Descriptor/EntityReferenceDescriptor";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import { QuestTypeDescription } from "../Descriptor/QuestEnumDescription";
import ScriptDescriptor from "../Descriptor/ScriptDescriptor";
import { dedupe } from "../Helper/ArrayHelper";
import { Renderable, mergeElements } from "../Helper/OutputHelper";
import { FGOText, removeSuffix } from "../Helper/StringHelper";
import Manager, { lang } from "../Setting/Manager";
import WarMap from "./WarMap/WarMap";

const warQuestHasGiftType = (war: War.War, giftType: Gift.GiftType): boolean => {
    for (const spot of war.spots) {
        for (const quest of spot.quests) {
            for (const gift of quest.gifts) {
                if (gift.type === giftType) {
                    return true;
                }
            }
        }
    }

    return false;
};

const BannerImage = (props: { src?: string; index: number }) => {
    const [src, setSrc] = useState(props.src);

    if (!src) return null;

    return (
        <div>
            <img
                style={{
                    maxWidth: "100%",
                    maxHeight: "5em",
                }}
                src={src}
                onError={() => {
                    setSrc(undefined);
                }}
                alt={`War's banner #${props.index} ${src}`}
            />
            <br />
        </div>
    );
};

const SpotImage = (props: { src?: string; name: string; height: string }) => {
    const [src, setSrc] = useState(props.src);

    if (src === undefined) return null;

    return (
        <img
            style={{
                width: "auto",
                height: props.height,
                position: "relative",
                top: "-10px",
            }}
            src={src}
            onError={() => {
                setSrc(undefined);
            }}
            alt={`Spot ${props.name}`}
        />
    );
};

const PhaseLink = ({ region, quest, phase }: { region: Region; quest: Quest.Quest; phase: number }) => {
    let description = `Arrow ${phase}`;
    const isRepeatable =
        quest.afterClear === Quest.QuestAfterClearType.REPEAT_LAST && phase === Math.max(...quest.phases);
    if (isRepeatable) description += " (repeatable)";
    const isRepeatableIcon = isRepeatable ? (
        <>
            &nbsp;
            <FontAwesomeIcon icon={faRepeat} />
        </>
    ) : null;
    const hasEnemies = quest.phasesWithEnemies.includes(phase);
    if (hasEnemies) description += " (has enemies data)";
    const hasEnemiesIcon = hasEnemies ? (
        <>
            &nbsp;
            <FontAwesomeIcon icon={faDragon} />
        </>
    ) : null;
    const isStory = quest.phasesNoBattle.includes(phase);
    if (isStory) description += " (has no battle)";
    const isStoryIcon = isStory ? (
        <>
            &nbsp;
            <FontAwesomeIcon icon={faBook} />
        </>
    ) : null;
    return (
        <Link title={description} key={phase} to={`/${region}/quest/${quest.id}/${phase}`} className="text-nowrap">
            {phase}
            {hasEnemiesIcon}
            {isRepeatableIcon}
            {isStoryIcon}
        </Link>
    );
};

const InterludeServantIcon = ({ region, quest }: { region: Region; quest: Quest.Quest }) => {
    const { t } = useTranslation();
    const condSvtGet = quest.releaseConditions.find((cond) => cond.type === CondType.SVT_GET);
    const condSvtLimit = quest.releaseConditions.find((cond) => cond.type === CondType.SVT_LIMIT);
    const condSvtFriendship = quest.releaseConditions.find((cond) => cond.type === CondType.SVT_FRIENDSHIP);

    if (quest.type === Quest.QuestType.FRIENDSHIP && (condSvtGet || condSvtLimit) && condSvtFriendship) {
        return (
            <>
                <EntityReferenceDescriptor region={region} svtId={(condSvtGet?.targetId ?? condSvtLimit?.targetId)!} />{" "}
                {t("interlude")}:{" "}
            </>
        );
    }

    return <></>;
};

const getQuestSection = (quest: Quest.Quest) => {
    if (quest.chapterSubStr !== "") {
        return removeSuffix(quest.chapterSubStr, ":");
    }
    if (quest.chapterSubId !== 0) {
        return quest.chapterSubId.toString();
    }
    return "";
};

const FirstPhaseLink = ({
    region,
    quest,
    children,
    lang,
}: {
    region: Region;
    quest: Quest.Quest;
    children: React.ReactNode;
    lang?: string;
}) => {
    if (quest.phases.length > 0) {
        const firstPhase = Math.min(...quest.phases);
        return (
            <Link to={`/${region}/quest/${quest.id}/${firstPhase}`} lang={lang}>
                {children}
            </Link>
        );
    } else {
        return <span lang={lang}>{children}</span>;
    }
};

const QuestTable = (props: {
    region: Region;
    quests: Quest.Quest[];
    itemMap: Map<number, Item.Item>;
    spots?: War.Spot[];
    showSection?: boolean;
    heelPortraits?: Map<number, Event.EventHeelPortrait>;
}) => {
    const { region, quests } = props,
        hasScript = props.quests.find((quest) => quest.phaseScripts.length > 0) !== undefined,
        hasSection =
            props.showSection &&
            (quests.find((quest) => quest.chapterSubId !== 0) || quests.find((quest) => quest.chapterSubStr !== ""));
    const { t } = useTranslation();
    return (
        <Table hover responsive>
            <thead>
                <tr>
                    {hasSection ? <th>{t("Section")}</th> : null}
                    <th>{t("ID")}</th>
                    <th>{t("Name")}</th>
                    {props.spots !== undefined ? <th>{t("Spot")}</th> : null}
                    <th>{t("Phases")}</th>
                    <th>{t("Reward")}</th>
                    {hasScript ? <th>{t("Script")}</th> : null}
                </tr>
            </thead>
            <tbody>
                {props.quests.map((quest, i) => (
                    <tr key={quest.id}>
                        {hasSection ? <td>{getQuestSection(quest)}</td> : null}
                        <td>
                            <FirstPhaseLink region={region} quest={quest}>
                                {quest.id}
                            </FirstPhaseLink>
                        </td>
                        <td style={{ maxWidth: "15em" }}>
                            <InterludeServantIcon region={region} quest={quest} />
                            <FirstPhaseLink region={region} quest={quest} lang={lang(region)}>
                                <FGOText text={quest.name} />
                            </FirstPhaseLink>
                        </td>
                        {props.spots !== undefined ? (
                            <td className="text-nowrap">
                                <SpotImage src={props.spots[i].image} name={props.spots[i].name} height="2em" />{" "}
                                <span style={{ whiteSpace: "normal" }} lang={lang(region)}>
                                    <FGOText text={props.spots[i].name} />
                                </span>
                            </td>
                        ) : null}
                        <td>
                            {mergeElements(
                                quest.phases.map((phase) => <PhaseLink region={region} quest={quest} phase={phase} />),
                                <br />
                            )}
                        </td>
                        <td>
                            {quest.giftIcon ? (
                                <>
                                    <div key={`${quest.giftIcon}`}>
                                        <img
                                            alt={`Quest Reward ${quest.giftIcon} icon`}
                                            style={{ maxWidth: "100%", maxHeight: "2em" }}
                                            src={quest.giftIcon}
                                        />
                                        <br />
                                    </div>
                                </>
                            ) : null}
                            {quest.gifts.map((gift) => (
                                <div key={`${gift.objectId}-${gift.priority}`}>
                                    <GiftDescriptor
                                        region={region}
                                        gift={gift}
                                        items={props.itemMap}
                                        heelPortraits={props.heelPortraits}
                                    />
                                    <br />
                                </div>
                            ))}
                        </td>
                        {hasScript ? (
                            <td>
                                {quest.phaseScripts.length > 0
                                    ? quest.phases.map((phase) => {
                                          const phaseScript = quest.phaseScripts.find((ps) => ps.phase === phase);
                                          if (phaseScript === undefined) {
                                              return (
                                                  <>
                                                      {phase}
                                                      <br />
                                                  </>
                                              );
                                          } else {
                                              return (
                                                  <>
                                                      <span className="text-nowrap">
                                                          {phaseScript.phase}:{" "}
                                                          {mergeElements(
                                                              phaseScript.scripts.map((script) => (
                                                                  <ScriptDescriptor
                                                                      region={region}
                                                                      scriptId={script.scriptId}
                                                                      scriptName={script.scriptId.slice(-2)}
                                                                      scriptType=""
                                                                  />
                                                              )),
                                                              ", "
                                                          )}
                                                      </span>
                                                      <br />
                                                  </>
                                              );
                                          }
                                      })
                                    : null}
                            </td>
                        ) : null}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

const MainQuests = (props: {
    region: Region;
    spots: War.Spot[];
    itemMap: Map<number, Item.Item>;
    heelPortraits?: Map<number, Event.EventHeelPortrait>;
}) => {
    const { t } = useTranslation();
    let mainQuests = [] as { quest: Quest.Quest; spot: War.Spot }[];
    for (let spot of props.spots) {
        for (let quest of spot.quests) {
            if (quest.type === Quest.QuestType.MAIN) {
                mainQuests.push({ quest, spot });
            }
        }
    }

    if (mainQuests.length === 0) return null;

    mainQuests.sort((a, b) => a.quest.id - b.quest.id);

    const questTable = (
        <QuestTable
            region={props.region}
            quests={mainQuests.map((quest) => quest.quest)}
            itemMap={props.itemMap}
            spots={mainQuests.map((quest) => quest.spot)}
            showSection={true}
            heelPortraits={props.heelPortraits}
        />
    );

    return <CollapsibleContent title={t("Main Quests")} content={questTable} subheader={false} />;
};

const Spot = (props: {
    region: Region;
    spot: War.Spot;
    filterQuest: (quest: Quest.Quest) => boolean;
    itemMap: Map<number, Item.Item>;
    heelPortraits?: Map<number, Event.EventHeelPortrait>;
}) => {
    const { region, spot, itemMap, heelPortraits } = props;
    const filteredQuest = spot.quests.filter(props.filterQuest);

    if (filteredQuest.length === 0) return null;

    const spotNameChanges = dedupe(
        spot.spotAdds
            .filter((spotAdd) => spotAdd.overrideType === War.SpotOverwriteType.NAME)
            .map((spotAdd) => spotAdd.targetText)
    ).join(" / ");

    const title = (
        <span lang={lang(region)}>
            <SpotImage src={spot.image} name={spot.name} height="1.5em" />
            <FGOText text={spot.name} /> {spotNameChanges !== "" && "/"} <FGOText text={spotNameChanges} />
        </span>
    );

    const questTable = (
        <QuestTable region={region} quests={filteredQuest} itemMap={itemMap} heelPortraits={heelPortraits} />
    );

    return <CollapsibleContent title={title} content={questTable} subheader initialOpen={filteredQuest.length > 0} />;
};

const SpotQuestList = (props: {
    title: Renderable;
    region: Region;
    spots: War.Spot[];
    filterQuest: (quest: Quest.Quest) => boolean;
    itemMap: Map<number, Item.Item>;
    last?: boolean;
    heelPortraits?: Map<number, Event.EventHeelPortrait>;
}) => {
    const spots = (
        <div>
            {props.spots.map((spot) => (
                <Spot
                    key={spot.id}
                    region={props.region}
                    spot={spot}
                    filterQuest={props.filterQuest}
                    itemMap={props.itemMap}
                    heelPortraits={props.heelPortraits}
                />
            ))}
        </div>
    );

    return (
        <CollapsibleContent title={props.title} content={spots} subheader={false} enableBottomMargin={!props.last} />
    );
};

const WarMapList = (props: {
    region: Region;
    title: string;
    maps: War.Map[];
    spots: War.Spot[];
    spotRoads: War.SpotRoad[];
    warName: string;
    warId: number;
    isEvent: boolean;
    last?: boolean;
}) => {
    const groupBy = <T,>(array: T[], property: (x: T) => string): { [key: string]: Array<T> } =>
        array.reduce((acc: { [key: string]: Array<T> }, cur: T) => {
            if (!acc[property(cur)]) {
                acc[property(cur)] = [];
            }
            acc[property(cur)].push(cur);
            return acc;
        }, {});

    let maps = [...props.maps],
        spots: War.Spot[] = [...props.spots];

    if (props.warId === 307) {
        spots = [];

        maps = maps.map((map) =>
            map.id !== 30702 ? { ...map, mapGimmicks: maps.find((_map) => _map.id === 30702)?.mapGimmicks ?? [] } : map
        );

        maps.forEach((_map) => {
            spots = spots.concat(props.spots.map((spot) => ({ ...spot, mapId: _map.id })));
        });
    }

    const mapsById = groupBy(maps, (map) => `${map.id}`);
    let last = false;

    const warMaps = (
        <Tabs id="war-maps-tabs" className="mb-3">
            {Object.keys(mapsById).map((mapId, index, array) => {
                let mapSpots: War.Spot[] = spots
                    .filter((spot) => spot.mapId === +mapId)
                    .filter((spot) => spot.x || spot.y);
                last = index === array.length - 1;
                return mapSpots.length > 0 ? (
                    <Tab eventKey={`${mapId}`} key={mapId} title={`#${mapId}`}>
                        <WarMap
                            region={props.region}
                            key={index}
                            map={mapsById[mapId][0]}
                            spots={mapSpots}
                            allSpots={props.spots}
                            spotRoads={props.spotRoads}
                            warName={props.warName}
                            warId={props.warId}
                            isEvent={props.isEvent}
                        />
                    </Tab>
                ) : null;
            })}
        </Tabs>
    );
    return <CollapsibleContent title={props.title} content={warMaps} subheader={false} enableBottomMargin={!last} />;
};

interface IProps extends RouteComponentProps, WithTranslation {
    region: Region;
    warId: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    war?: War.War;
    itemCache: Map<number, Item.Item>;
    event?: Event.Event;
    warAddBgms: Bgm.BgmEntity[];
    spotRefs: Map<number, React.Ref<any>>;
}

class WarPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            itemCache: new Map(),
            spotRefs: new Map(),
            warAddBgms: [],
        };
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadWar();
        this.loadItemMap();
    }

    async loadItemMap() {
        Api.itemList().then((items) =>
            this.setState({
                itemCache: new Map(items.map((item) => [item.id, item])),
            })
        );
    }

    async loadWar() {
        Api.war(this.props.warId)
            .then((war) => {
                document.title = `[${this.props.region}] War - ${war.longName} - Atlas Academy DB`;
                this.setState({ war, loading: false });
                Promise.all(
                    war.warAdds
                        .filter((warAdd) => warAdd.type === War.WarOverwriteType.BGM)
                        .map((warAdd) => Api.bgm(warAdd.overwriteId))
                ).then((warAddBgms) => this.setState({ warAddBgms }));
                if (warQuestHasGiftType(war, Gift.GiftType.EVENT_HEEL_PORTRAIT)) {
                    Api.event(war.eventId).then((event) => this.setState({ event }));
                }
            })
            .catch((error) => this.setState({ error, loading: false }));
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.war) return <Loading />;

        const t = this.props.t;

        const war = this.state.war;

        const event =
            war.eventId !== 0 ? (
                <Link to={`/${this.props.region}/event/${war.eventId}`}>
                    {war.eventName !== "" ? war.eventName : `${t("Event")} ${war.eventId}`}
                </Link>
            ) : (
                ""
            );

        let banners: Set<string> = new Set();
        if (war.banner !== undefined) banners.add(war.banner);
        for (let warAdd of war.warAdds) {
            if (warAdd.type === War.WarOverwriteType.BANNER && warAdd.overwriteBanner !== undefined) {
                banners.add(warAdd.overwriteBanner);
            }
        }

        const bannerImages = (
            <>
                {Array.from(banners).map((banner, index) => (
                    <BannerImage key={index} index={index} src={banner} />
                ))}
            </>
        );

        const bgms = new Map([[war.bgm.id, war.bgm]]);
        for (const map of war.maps) {
            bgms.set(map.bgm.id, map.bgm);
        }
        for (const bgm of this.state.warAddBgms) {
            bgms.set(bgm.id, bgm);
        }

        const bgmDeduped = Array.from(bgms.values()).filter((bgm) => bgm.id !== 0);

        const bgmPlayers = bgmDeduped.map((bgm, index) => {
            return (
                <div
                    key={bgm.id}
                    style={{
                        marginBottom: index === bgmDeduped.length - 1 ? 0 : "0.75em",
                    }}
                >
                    <BgmDescriptor region={this.props.region} bgm={bgm} showLink={true} />
                </div>
            );
        });

        const openingScript =
            war.scriptId === "NONE" ? (
                ""
            ) : (
                <Link to={`/${this.props.region}/script/${war.scriptId}`}>{war.scriptId}</Link>
            );

        const heelPortraits =
            this.state.event && this.state.event.heelPortraits
                ? new Map(this.state.event.heelPortraits.map((heel) => [heel.id, heel]))
                : undefined;

        return (
            <div>
                <h1 className="text-prewrap mb-3" lang={lang(this.props.region)}>
                    {war.flags.indexOf(War.WarFlag.SUB_FOLDER) === -1 ? war.longName : war.name}
                </h1>
                <div className="mb-5">
                    <DataTable
                        data={[
                            { label: t("ID"), value: war.id },
                            {
                                label: t("Name"),
                                value: (
                                    <span className="text-prewrap" lang={lang(this.props.region)}>
                                        {war.name}
                                        <br />
                                        {war.originalName === war.name || war.originalName}
                                    </span>
                                ),
                            },
                            {
                                label: t("Long Name"),
                                value: (
                                    <span className="text-prewrap" lang={lang(this.props.region)}>
                                        {war.longName}
                                        <br />
                                        {war.originalLongName === war.longName || war.originalLongName}
                                    </span>
                                ),
                            },
                            { label: t("Age"), value: <span lang={lang(this.props.region)}>{war.age}</span> },
                            { label: t("Event"), value: event },
                            { label: t("Opening Script"), value: openingScript },
                            { label: t("Banner"), value: bannerImages },
                            { label: t("BGM"), value: <>{bgmPlayers}</> },
                            {
                                label: "Raw",
                                value: (
                                    <Row>
                                        <Col>
                                            <RawDataViewer
                                                text="Nice"
                                                data={war}
                                                url={Api.getUrl("nice", "war", this.props.warId)}
                                            />
                                        </Col>
                                        <Col>
                                            <RawDataViewer
                                                text="Raw"
                                                data={Api.getUrl("raw", "war", this.props.warId)}
                                            />
                                        </Col>
                                    </Row>
                                ),
                            },
                        ]}
                    />
                </div>
                <WarMapList
                    region={this.props.region}
                    maps={war.maps}
                    spots={war.spots}
                    spotRoads={war.spotRoads}
                    warName={war.name}
                    warId={war.id}
                    isEvent={war.flags.includes(War.WarFlag.IS_EVENT)}
                    title={t("Maps")}
                />
                <MainQuests
                    region={this.props.region}
                    spots={war.spots}
                    itemMap={this.state.itemCache}
                    heelPortraits={heelPortraits}
                />
                {[
                    Quest.QuestType.FREE,
                    Quest.QuestType.EVENT,
                    Quest.QuestType.FRIENDSHIP,
                    Quest.QuestType.WAR_BOARD,
                    Quest.QuestType.HERO_BALLAD,
                ]
                    .filter((questType) => {
                        for (let { quests } of war.spots) if (quests.find((q) => q.type === questType)) return true;

                        return false;
                    })
                    .map((questType, index, array) => {
                        const questTypeDescription = (
                            <>
                                <QuestTypeDescription questType={questType} /> {t("Quests")}
                            </>
                        );
                        let questFilter = (quest: Quest.Quest) => quest.type === questType;

                        return (
                            <SpotQuestList
                                key={questType}
                                title={questTypeDescription}
                                region={this.props.region}
                                spots={war.spots}
                                filterQuest={questFilter}
                                itemMap={this.state.itemCache}
                                last={index === array.length - 1}
                                heelPortraits={heelPortraits}
                            />
                        );
                    })}
            </div>
        );
    }
}

export default withRouter(withTranslation()(WarPage));
