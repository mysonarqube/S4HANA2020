//@ui5-bundle i2d/mpe/workassign/manages1/Component-h2-preload.js
sap.ui.require.preload({
	"i2d/mpe/workassign/manages1/manifest.json":'{"_version":"1.7.0","sap.app":{"id":"i2d.mpe.workassign.manages1","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"8.0.6"},"title":"{{appTitle}}","description":"{{appDescription}}","tags":{"keywords":[]},"ach":"PP-PEO-SFE","resources":"resources.json","dataSources":{"mainService":{"uri":"/sap/opu/odata/sap/MPE_EXEC_OAI_WRK_ASSGMT_SRV/","type":"OData","settings":{"annotations":["MPE_EXEC_OAI_WRK_ASSGMT_ANNO_MDL","localAnnotations"],"localUri":"localService/metadata.xml"}},"MPE_EXEC_OAI_WRK_ASSGMT_ANNO_MDL":{"uri":"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Annotations(TechnicalName=\'MPE_EXEC_OAI_WRK_ASSGMT_ANNO_MDL\',Version=\'0001\')/$value/","type":"ODataAnnotation","settings":{"localUri":"localService/MPE_EXEC_OAI_WRK_ASSGMT_ANNO_MDL.xml"}},"localAnnotations":{"uri":"annotations/annotations.xml","type":"ODataAnnotation","settings":{"localUri":"annotations/annotations.xml"}},"MPE_MATERIAL_POVER":{"uri":"/sap/opu/odata/sap/MPE_MATERIAL_POVER/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/MPE_MATERIAL_POVER/metadata.xml"}},"MPE_PRODNORD_POVER":{"uri":"/sap/opu/odata/sap/MPE_PRODNORD_POVER/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/MPE_PRODNORD_POVER/metadata.xml"}},"MPE_WORKCENTER_POVER":{"uri":"/sap/opu/odata/sap/MPE_WORKCENTER_POVER/","type":"OData","settings":{"odataVersion":"2.0","localUri":"webapp/localService/MPE_WORKCENTER_POVER/metadata.xml"}}},"offline":false,"sourceTemplate":{"id":"servicecatalog.connectivityComponent","version":"0.0.0"}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_belize"]},"sap.ui5":{"flexEnabled":true,"resources":{"js":[],"css":[]},"dependencies":{"minUI5Version":"1.78.17","libs":{"sap.ui.core":{"lazy":true},"sap.m":{"lazy":true},"sap.ui.comp":{"lazy":true},"sap.uxap":{"lazy":true},"sap.ui.generic.app":{"lazy":false},"sap.suite.ui.generic.template":{"lazy":false},"sap.ui.layout":{"lazy":true},"sap.f":{"lazy":true},"sap.ushell":{"lazy":true},"sap.collaboration":{"lazy":true},"sap.i2d.mpe.lib.commons1":{"minVersion":"11.8.0-SNAPSHOT","lazy":true},"sap.i2d.mpe.lib.popovers1":{"minVersion":"11.5.0-SNAPSHOT","lazy":true},"sap.ui.fl":{}},"components":{}},"models":{"i18n":{"preload":false,"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"},"@i18n":{"preload":false,"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"},"i18n|sap.suite.ui.generic.template.ListReport|C_ProcgExecOpActyInstceTP":{"preload":false,"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/ListReport/C_ProcgExecOpActyInstceTP/i18n.properties"},"i18n|sap.suite.ui.generic.template.ObjectPage|C_ProcgExecOpActyInstceTP":{"preload":false,"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/ObjectPage/C_ProcgExecOpActyInstceTP/i18n.properties"},"i18n|sap.suite.ui.generic.template.ObjectPage|I_OpActyDocInfoRecdObjLink":{"preload":false,"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/ObjectPage/I_OpActyDocInfoRecdObjLink/i18n.properties"},"Material":{"preload":true,"dataSource":"MPE_MATERIAL_POVER","settings":{"metadataUrlParams":{"sap-documentation":"heading"}}},"PRODORD":{"preload":true,"dataSource":"MPE_PRODNORD_POVER","settings":{"metadataUrlParams":{"sap-documentation":"heading"}}},"WORKCENTER":{"preload":true,"dataSource":"MPE_WORKCENTER_POVER","settings":{"metadataUrlParams":{"sap-documentation":"heading"}}},"":{"preload":true,"dataSource":"mainService","settings":{"defaultBindingMode":"TwoWay","defaultCountMode":"None","refreshAfterChange":false}}},"extends":{"extensions":{"sap.ui.controllerExtensions":{"sap.suite.ui.generic.template.ListReport.view.ListReport":{"controllerName":"i2d.mpe.workassign.manages1.ext.controller.ListReportExtension","sap.ui.generic.app":{"C_ProcgExecOpActyInstceTP":{"EntitySet":"C_ProcgExecOpActyInstceTP","Actions":{"AssignOperators":{"id":"AssignOperatorsButton","text":"{i18n>AssignOperatorsButton}","press":"onAssignOperators","global":false,"requiresSelection":true,"applicablePath":""},"UnassignOperators":{"id":"UnassignOperatorsButton","text":"{i18n>UnassignOperatorsButton}","press":"onUnassignOperators","global":false,"requiresSelection":true,"applicablePath":"OpActyHasUserAssignments"},"UnassignAll":{"id":"UnassignAllButton","text":"{i18n>UnassignAllButton}","press":"onUnassignAll","global":false,"requiresSelection":true,"applicablePath":"OpActyHasUserAssignments"},"EditTargetTime":{"id":"EditTargetTimeButton","text":"{i18n>EditTargetTimeButton}","press":"onEditTargetTime","global":false,"requiresSelection":true,"applicablePath":""}}}}}},"sap.ui.viewExtensions":{"sap.suite.ui.generic.template.ListReport.view.ListReport":{"SmartFilterBarControlConfigurationExtension|C_ProcgExecOpActyInstceTP":{"className":"sap.ui.core.Fragment","fragmentName":"i2d.mpe.workassign.manages1.ext.fragment.CustomFilter","type":"XML"},"ResponsiveTableColumnsExtension|C_ProcgExecOpActyInstceTP":{"className":"sap.ui.core.Fragment","fragmentName":"i2d.mpe.workassign.manages1.ext.view.Columns","type":"XML"},"ResponsiveTableCellsExtension|C_ProcgExecOpActyInstceTP":{"className":"sap.ui.core.Fragment","fragmentName":"i2d.mpe.workassign.manages1.ext.view.Cells","type":"XML"}}}}},"contentDensities":{"compact":true,"cozy":true}},"sap.ui.generic.app":{"_version":"1.3.0","pages":{"ListReport|C_ProcgExecOpActyInstceTP":{"entitySet":"C_ProcgExecOpActyInstceTP","component":{"name":"sap.suite.ui.generic.template.ListReport","list":true,"settings":{"gridTable":false,"multiSelect":true,"hideTableVariantManagement":true,"smartVariantManagement":true,"quickVariantSelection":{"showCounts":true,"variants":{"0":{"key":"_tab1","annotationPath":"com.sap.vocabularies.UI.v1.SelectionVariant#AllOperationActivities"},"1":{"key":"_tab2","annotationPath":"com.sap.vocabularies.UI.v1.SelectionVariant#UnassignedOperationActivities"}}}}}}}},"sap.fiori":{"registrationIds":["F3435"],"archeType":"transactional"},"sap.platform.hcp":{"uri":""}}',
/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
	"i2d/mpe/workassign/manages1/Component.js":function(){jQuery.sap.declare("i2d.mpe.workassign.manages1.Component");sap.ui.getCore().loadLibrary("sap.ui.generic.app");jQuery.sap.require("sap.ui.generic.app.AppComponent");sap.ui.generic.app.AppComponent.extend("i2d.mpe.workassign.manages1.Component",{metadata:{"manifest":"json"}});
}
},"i2d/mpe/workassign/manages1/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"i2d/mpe/workassign/manages1/Component.js":["sap/ui/generic/app/AppComponent.js"],
"i2d/mpe/workassign/manages1/ext/controller/ListReportExtension.controller.js":["i2d/mpe/workassign/manages1/ext/fragment/ChangePriorityDialog.js","i2d/mpe/workassign/manages1/ext/fragment/EditTimeForOADialog.js","i2d/mpe/workassign/manages1/ext/utils/Formatter.js","sap/m/MessageBox.js"],
"i2d/mpe/workassign/manages1/ext/fragment/AssignOperatorDialog.fragment.xml":["sap/f/Avatar.js","sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Dialog.js","sap/m/HBox.js","sap/m/Label.js","sap/m/Link.js","sap/m/NavContainer.js","sap/m/ObjectIdentifier.js","sap/m/ObjectStatus.js","sap/m/Page.js","sap/m/SearchField.js","sap/m/Table.js","sap/m/Text.js","sap/m/Title.js","sap/m/Toolbar.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/form/SimpleForm.js"],
"i2d/mpe/workassign/manages1/ext/fragment/ChangePriorityDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/StepInput.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/fragment/ChangePriorityDialog.js":["sap/m/MessageBox.js","sap/ui/model/json/JSONModel.js","sap/ui/model/resource/ResourceModel.js"],
"i2d/mpe/workassign/manages1/ext/fragment/CustomFilter.fragment.xml":["sap/m/MultiComboBox.js","sap/ui/comp/smartfilterbar/ControlConfiguration.js","sap/ui/core/Fragment.js","sap/ui/core/Item.js"],
"i2d/mpe/workassign/manages1/ext/fragment/EditTimeForOADialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/HBox.js","sap/m/Input.js","sap/m/Label.js","sap/m/Select.js","sap/m/VBox.js","sap/ui/core/Fragment.js","sap/ui/core/Item.js"],
"i2d/mpe/workassign/manages1/ext/fragment/EditTimeForOADialog.js":["sap/m/MessageBox.js","sap/ui/model/json/JSONModel.js","sap/ui/model/resource/ResourceModel.js"],
"i2d/mpe/workassign/manages1/ext/fragment/UnassignOperatorDialog.fragment.xml":["sap/f/Avatar.js","sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Dialog.js","sap/m/HBox.js","sap/m/ObjectIdentifier.js","sap/m/Table.js","sap/m/Text.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/fragment/UsersPopover.fragment.xml":["sap/m/List.js","sap/m/NavContainer.js","sap/m/ObjectAttribute.js","sap/m/ObjectHeader.js","sap/m/Page.js","sap/m/Popover.js","sap/m/StandardListItem.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/AssignedToTableCell.fragment.xml":["sap/f/Avatar.js","sap/m/HBox.js","sap/m/Link.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/AssignedToTableColumn.fragment.xml":["sap/m/Column.js","sap/m/Text.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/Cells.fragment.xml":["i2d/mpe/workassign/manages1/ext/view/AssignedToTableCell.fragment.xml","i2d/mpe/workassign/manages1/ext/view/EffectivityParameterDescTableCell.fragment.xml","i2d/mpe/workassign/manages1/ext/view/MaterialTableCell.fragment.xml","i2d/mpe/workassign/manages1/ext/view/OperationTableCell.fragment.xml","i2d/mpe/workassign/manages1/ext/view/ProductionHoldTableCell.fragment.xml","i2d/mpe/workassign/manages1/ext/view/ProductionPlantTableCell.fragment.xml","i2d/mpe/workassign/manages1/ext/view/StartDateTableCell.fragment.xml","i2d/mpe/workassign/manages1/ext/view/WorkCenterTableCell.fragment.xml","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/Columns.fragment.xml":["i2d/mpe/workassign/manages1/ext/view/AssignedToTableColumn.fragment.xml","i2d/mpe/workassign/manages1/ext/view/EffectivityParameterDescTableColumn.fragment.xml","i2d/mpe/workassign/manages1/ext/view/MaterialTableColumn.fragment.xml","i2d/mpe/workassign/manages1/ext/view/OperationTableColumn.fragment.xml","i2d/mpe/workassign/manages1/ext/view/ProductionHoldTableColumn.fragment.xml","i2d/mpe/workassign/manages1/ext/view/ProductionPlantTableColumn.fragment.xml","i2d/mpe/workassign/manages1/ext/view/StartDateTableColumn.fragment.xml","i2d/mpe/workassign/manages1/ext/view/WorkCenterTableColumn.fragment.xml","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/EffectivityParameterDescTableCell.fragment.xml":["sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/EffectivityParameterDescTableColumn.fragment.xml":["sap/m/Column.js","sap/m/Text.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/MaterialTableCell.fragment.xml":["sap/m/Link.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/MaterialTableColumn.fragment.xml":["sap/m/Column.js","sap/m/Text.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/OperationTableCell.fragment.xml":["sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/OperationTableColumn.fragment.xml":["sap/m/Column.js","sap/m/Text.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/OrderTableCell.fragment.xml":["sap/m/Link.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/OrderTableColumn.fragment.xml":["sap/m/Column.js","sap/m/Text.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/ProductionHoldTableCell.fragment.xml":["sap/m/HBox.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js"],
"i2d/mpe/workassign/manages1/ext/view/ProductionHoldTableColumn.fragment.xml":["sap/m/Column.js","sap/m/Text.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/ProductionPlantTableCell.fragment.xml":["sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/ProductionPlantTableColumn.fragment.xml":["sap/m/Column.js","sap/m/Text.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/StartDateTableCell.fragment.xml":["sap/m/HBox.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js"],
"i2d/mpe/workassign/manages1/ext/view/StartDateTableColumn.fragment.xml":["sap/m/Column.js","sap/m/Text.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/WorkCenterTableCell.fragment.xml":["sap/m/Link.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"i2d/mpe/workassign/manages1/ext/view/WorkCenterTableColumn.fragment.xml":["sap/m/Column.js","sap/m/Text.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"]
}});
