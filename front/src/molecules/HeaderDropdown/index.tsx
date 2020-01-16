import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CaretDown } from 'styled-icons/boxicons-regular';

interface DropdownProps extends React.DetailedHTMLFactory<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>  {
    children: any
    className?: string
}

interface DropdownMenuProps {
    opened: boolean;
}

interface DropdownToggleProps extends React.DetailedHTMLFactory<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: any
    className?: string
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Menu = styled.ul.attrs(({ opened }:DropdownMenuProps) => ({ opened }))`
    display: ${({ opened }:DropdownMenuProps) => opened ? 'block' : 'none'};
    margin: 0;
    padding: 10px 0 0;
    position: absolute;
    list-style: none;
    left: 0;
    transform: translateX(-50%);
    width: 150px;
    margin-top: 25px;
    background-color: black;
    color: white;

    &::before {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 10px 10px 10px;
        border-color: transparent transparent #ffffff transparent;
        content: " ";
        display: block;
        position: absolute;
        top: -17px;
        left: calc(50% + 5px);
    }
`;

Menu.displayName = "DropdownMenu"

const Toggle = styled((props:DropdownToggleProps) => {
    return (
        <div className={props.className} onClick={props.onClick}>
            {props.children} <CaretDown />
        </div>
    );
})`
    position: relative;
    cursor: pointer;
    padding-right: 20px;
    text-align: right;
    color: white;

    font-family: HelveticaNeue;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
    display: flex;
    align-items: center;

    svg {
        position: absolute;
        top: 50%;
        right: 0;
        width: 15px;
        height: 15px;
        transform: translateY(-50%);
        color: white;
    }
`

Toggle.displayName = "DropdownToggle"

const Item = styled.li`
    cursor: pointer;
    padding: 0 10px 7px;
    

    &:hover {
        span {
            text-decoration: underline;
        }
    }

    &::first-letter {
        text-transform: uppercase;
    }
`


const Dropdown:any = styled((props:DropdownProps) => {
    const childrens = React.Children.toArray(props.children);

    const { DropdownToggle, DropdownMenu } = childrens.reduce((p:any, c:any) => {
        if (['DropdownToggle', 'DropdownMenu'].includes(c.type.displayName))
            return ({ ...p, [c.type.displayName]: c })
        if (c.type.displayName === 'DropdownItem')
            return ({ ...p, DropdownItems: [...p.DropdownItems, c ] })
        return p;
    }, { DropdownToggle: null, DropdownMenu: null })

    const [isOpen, setIsOpen] = useState(false);

    const handleClickAwayListener = () => isOpen && setIsOpen(false)

    useEffect(() => {
        window.addEventListener('click', handleClickAwayListener);

        return () => {
            window.removeEventListener('click', handleClickAwayListener);
        }
    })

    return (
        <div className={props.className}>
            {DropdownToggle && React.cloneElement(DropdownToggle, {
                onClick: () => setIsOpen(!isOpen)
            })}
            {DropdownMenu && React.cloneElement(DropdownMenu, {
                opened: isOpen
            })}
        </div>
    )
})`
    position: relative;
`

Dropdown.Toggle = Toggle;
Dropdown.Menu = Menu;
Dropdown.Item = Item;


export default Dropdown;