import {Region, Servant} from "@atlasacademy/api-connector";
import {toTitleCase} from "@atlasacademy/api-descriptor";
import React from "react";
import {Table} from "react-bootstrap";
import ClassIcon from "../../Component/ClassIcon";
import CommandCard from "../../Component/CommandCard";
import {Renderable} from "../../Helper/OutputHelper";
import RawDataViewer from "../../Component/RawDataViewer";
import CraftEssenceReferenceDescriptor from "../../Descriptor/CraftEssenceReferenceDescriptor";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";
import {formatNumber} from "../../Helper/OutputHelper";
import "./ServantMainData.css";

interface IProps {
    region: Region;
    servant: Servant.Servant;
    assetType?: "ascension" | "costume";
    assetId?: number;
}

type RenderableRow = {
    title: Renderable,
    content: Renderable
};

class ServantMainData extends React.Component<IProps> {
    private renderDoubleRow(content: [RenderableRow, RenderableRow]): Renderable {
        return (
            <tr>
                {content.map(row => <><th>{row.title}</th><td>{row.content}</td></>)}
            </tr>
        )
    }

    private renderSpanningRow(content: RenderableRow) : Renderable {
        return (
            <tr>
                <th>{content.title}</th>
                <td colSpan={3}>{content.content}</td>
            </tr>
        )
    }
    render() {
        const servant = this.props.servant;

        return (
            <div>
                <h1>
                    <ClassIcon className={servant.className} rarity={servant.rarity} height={50}/>
                    &nbsp;
                    {servant.name}
                </h1>

                <Table bordered className="servant-main-data-span-cell">
                    <tbody>
                        {this.renderDoubleRow([
                            { title: "ID", content: servant.id }, 
                            { title: "Collection", content: servant.collectionNo }
                        ])}
                        {this.renderDoubleRow([
                            { title: "Class", content: toTitleCase(servant.className) }, 
                            { title: "Attribute", content: toTitleCase(servant.attribute) }
                        ])}
                        {this.renderDoubleRow([
                            { title: "Rarity", content: <RarityDescriptor rarity={servant.rarity}/> }, 
                            { title: "Cost", content: servant.cost }
                        ])}
                        {this.renderSpanningRow({
                            title: "HP",
                            content: (
                                <div>
                                    Base: {formatNumber(servant.hpBase)}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    Max: {formatNumber(servant.hpMax)}
                                </div>
                            )
                        })}
                        {this.renderSpanningRow({
                            title: "ATK",
                            content: (
                                <div>
                                    Base: {formatNumber(servant.atkBase)}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    Max: {formatNumber(servant.atkMax)}
                                </div>
                            )
                        })}
                        {this.renderSpanningRow({
                            title: "Card",
                            content: (
                                <div>
                                    {servant.cards.map((card, index) => {
                                        return <CommandCard key={index}
                                                            height={60}
                                                            card={card}
                                                            servant={servant}
                                                            assetType={this.props.assetType}
                                                            assetId={this.props.assetId}/>;
                                    })}
                                </div>
                            )
                        })}
                        {this.renderSpanningRow({
                            title: "Bond CE",
                            content: (
                                servant.bondEquip
                                ? <CraftEssenceReferenceDescriptor region={this.props.region} id={servant.bondEquip}/>
                                : ''
                            )
                        })}
                    </tbody>
                </Table>
                <span>
                    <RawDataViewer text="Nice" data={servant}/>
                    <RawDataViewer
                        text="Raw"
                        data={`https://api.atlasacademy.io/raw/${this.props.region}/servant/${this.props.servant.id}?expand=true&lore=true`}/>
                </span>
            </div>
        );
    }
}

export default ServantMainData;
