import { useEffect, useState, useContext } from 'react';
import * as PluginSdk from 'bigbluebutton-html-plugin-sdk';

import {
  ExtensibleAreaComponentManagerProps, ExtensibleArea,
  ExtensibleAreaComponentManager,
} from '../../types';
import { PluginsContext } from '../../../../components-data/plugin-context/context';

const UserListDropdownPluginStateContainer = ((
  props: ExtensibleAreaComponentManagerProps,
) => {
  const {
    uuid,
    generateItemWithId,
    extensibleAreaMap,
    pluginApi,
  } = props;
  const [
    userListDropdownItems,
    setUserListDropdownItems,
  ] = useState<PluginSdk.UserListDropdownInterface[]>([]);

  const {
    pluginsExtensibleAreasAggregatedState,
    setPluginsExtensibleAreasAggregatedState,
  } = useContext(PluginsContext);

  useEffect(() => {
    // Change this plugin provided toolbar items
    extensibleAreaMap[uuid].userListDropdownItems = userListDropdownItems;

    // Update context with computed aggregated list of all plugin provided toolbar items
    const aggregatedUserListDropdownItems = (
      [] as PluginSdk.UserListDropdownInterface[]).concat(
      ...Object.values(extensibleAreaMap)
        .map((extensibleArea: ExtensibleArea) => extensibleArea.userListDropdownItems),
    );
    setPluginsExtensibleAreasAggregatedState(
      {
        ...pluginsExtensibleAreasAggregatedState,
        userListDropdownItems: aggregatedUserListDropdownItems,
      },
    );
  }, [userListDropdownItems]);

  pluginApi.setUserListDropdownItems = (items: PluginSdk.UserListDropdownInterface[]) => {
    const itemsWithId = items.map(generateItemWithId) as PluginSdk.UserListDropdownInterface[];
    return setUserListDropdownItems(itemsWithId);
  };
  return null;
}) as ExtensibleAreaComponentManager;

export default UserListDropdownPluginStateContainer;
