jT.tools['ketcher'] = 
"" +
"<div>" +
"<table id=\"ketcher_window\">" +
"<tr align=\"center\" id=\"main_toolbar\">" +
"<td style=\"width:36px\"><div style=\"position:relative\"><img class=\"sideButton modeButton stateButton\" id=\"selector\" selid=\"selector_lasso\" src=\"png/action/lasso.png\" alt=\"\" title=\"Select Tool (Esc)\" /><img class=\"dropdownButton\" id=\"selector_dropdown\" src=\"png/dropdown.png\" alt=\"\" /></div></td>" +
"<td class=\"toolDelimiter\"></td>" +
"<!--td style=\"width:36px\"><object type=\"image/svg+xml\" width=\"28\" height=\"28\" data=\"svg/document-new28x28.svg\"></object></td-->" +
"<td class=\"toolButtonCell toolButton\" id=\"new\"><img src=\"png/action/document-new.png\" alt=\"\" title=\"New (Ctrl+N)\" /></td>" +
"<td class=\"toolButtonCell toolButton\" id=\"open\"><img src=\"png/action/document-open.png\" alt=\"\" title=\"Open... (Ctrl+O)\" /></td>" +
"<td class=\"toolButtonCell toolButton\" id=\"save\"><img src=\"png/action/document-save-as.png\" alt=\"\" title=\"Save As... (Ctrl+S)\" /></td>" +
"<td class=\"toolDelimiter\"></td>" +
"<td class=\"toolButtonCell toolButton buttonDisabled\" id=\"undo\"><img src=\"png/action/edit-undo.png\" alt=\"\" title=\"Undo (Ctrl+Z)\" /></td>" +
"<td class=\"toolButtonCell toolButton buttonDisabled\" id=\"redo\"><img src=\"png/action/edit-redo.png\" alt=\"\" title=\"Redo (Ctrl+Shift+Z)\" /></td>" +
"<td class=\"toolButtonCell toolButton buttonDisabled\" id=\"cut\"><img src=\"png/action/edit-cut.png\" alt=\"\" title=\"Cut (Ctrl+X)\" /></td>" +
"<td class=\"toolButtonCell toolButton buttonDisabled\" id=\"copy\"><img src=\"png/action/edit-copy.png\" alt=\"\" title=\"Copy (Ctrl+C)\" /></td>" +
"<td class=\"toolButtonCell toolButton buttonDisabled\" id=\"paste\"><img src=\"png/action/edit-paste.png\" alt=\"\" title=\"Paste (Ctrl+V)\" /></td>" +
"<td class=\"toolDelimiter\"></td>" +
"<td class=\"toolButtonCell toolButton\" id=\"zoom_in\"><img src=\"png/action/view-zoom-in.png\" alt=\"\" title=\"Zoom In (+)\" /></td>" +
"<td class=\"toolButtonCell toolButton\" id=\"zoom_out\"><img src=\"png/action/view-zoom-out.png\" alt=\"\" title=\"Zoom Out (-)\" /></td>" +
"<td class=\"toolDelimiter\"></td>" +
"<td class=\"toolButtonCell toolButton serverRequired\" id=\"clean_up\"><img title=\"Clean Up (Ctrl+L)\" alt=\"\" src=\"png/action/layout.png\" /></td>" +
"<td class=\"toolButtonCell toolButton serverRequired\" id=\"aromatize\"><img title=\"Aromatize\" alt=\"\" src=\"png/action/arom.png\" /></td>" +
"<td class=\"toolButtonCell toolButton serverRequired\" id=\"dearomatize\"><img title=\"Dearomatize\" alt=\"\" src=\"png/action/dearom.png\" /></td>" +
"<td style=\"width:100%\"></td>" +
"<td style=\"width:1px\" rowspan=\"14\"></td>" +
"<td style=\"width:36px;padding:0 2px 0 0;\"><a href=\"http://www.ggasoftware.com/\" target=\"_blank\"><img src=\"png/logo.png\" alt=\"\" title=\"GGA Software Services\" /></a></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td><img class=\"sideButton modeButton\" id=\"select_erase\" src=\"png/action/edit-clear.png\" alt=\"\" title=\"Erase\" /></td>" +
"<td colspan=\"18\" rowspan=\"13\"><div id=\"client_area\"></div></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_h\" title=\"H Atom (H)\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td><div style=\"position:relative\"><div class=\"sideButton modeButton stateButton\" id=\"bond\" selid=\"bond_single\" title=\"Single Bond (1)\"></div><img class=\"dropdownButton\" id=\"bond_dropdown\" src=\"png/dropdown.png\" alt=\"\" /></div></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_c\" title=\"C Atom (C)\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td><div class=\"sideButton modeButton\" id=\"chain\" title=\"Chain Tool\"></div></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_n\" title=\"N Atom (N)\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td><div style=\"position:relative\"><div class=\"sideButton modeButton stateButton\" id=\"template\" selid=\"template_0\" title=\"Benzene (T)\"></div><img class=\"dropdownButton\" id=\"template_dropdown\" src=\"png/dropdown.png\" alt=\"\" /></div></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_o\" title=\"O Atom (O)\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td><div class=\"sideButton modeButton\" id=\"charge_plus\" title=\"Charge Plus (5)\"></div></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_s\" title=\"S Atom (S)\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td><div class=\"sideButton modeButton\" id=\"charge_minus\" title=\"Charge Minus (5)\"></div></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_p\" title=\"P Atom (P)\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td><div style=\"position:relative\"><img class=\"sideButton modeButton stateButton\" id=\"reaction\" selid=\"reaction_arrow\" src=\"png/action/reaction-arrow.png\" alt=\"\" title=\"Reaction Mapping Tool\" /><img class=\"dropdownButton\" id=\"reaction_dropdown\" src=\"png/dropdown.png\" alt=\"\" /></div></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_f\" title=\"F Atom (F)\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td><img class=\"sideButton modeButton\" id=\"sgroup\" src=\"png/action/sgroup.png\" alt=\"\" title=\"S-Group (Ctrl+G)\" /></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_cl\" title=\"Cl Atom (Shift+C)\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td><div style=\"position:relative\"><img class=\"sideButton modeButton stateButton\" id=\"rgroup\" selid=\"rgroup_label\" src=\"png/action/rgroup-label.png\" alt=\"\" title=\"R-Group Tool (Shift+R)\" /><img class=\"dropdownButton\" id=\"rgroup_dropdown\" src=\"png/dropdown.png\" alt=\"\" /></div></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_br\" title=\"Br Atom (Shift+B)\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_i\" title=\"I Atom (I)\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_table\" title=\"Periodic table\"></div></td>" +
"</tr>" +
"<tr align=\"center\" class=\"sideButtonCell\">" +
"<td></td>" +
"<td><div class=\"sideButton modeButton\" id=\"atom_reagenerics\" title=\"Reaxys Generics\"></div></td>" +
"</tr>" +
"</table>" +
"" +
"<div class=\"dropdownList\" id=\"selector_dropdown_list\" style=\"display:none\">" +
"<table>" +
"" +
"<tr class=\"dropdownListItem\" id=\"selector_lasso\" title=\"Lasso Selection Tool\">" +
"<td><div id=\"select_lasso_todo\"><img src=\"png/action/lasso.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>Lasso selection tool</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"selector_square\" title=\"Rectangle Selection Tool\">" +
"<td><div id=\"select_square_todo\"><img src=\"png/action/rectangle.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>Rectangle selection tool</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"selector_fragment\" title=\"Fragment Selection Tool\">" +
"<td><div id=\"select_fragment\"><img src=\"png/action/structure.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>Fragment selection tool</td>" +
"</tr>" +
"</table>" +
"</div>" +
"" +
"<div class=\"dropdownList renderFirst\" id=\"bond_dropdown_list\" style=\"display:none\">" +
"<table>" +
"<tr class=\"dropdownListItem\" id=\"bond_single\" title=\"Single Bond (1)\">" +
"<td><div id=\"bond_single_preview\"></div>Single</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_double\" title=\"Double Bond (2)\">" +
"<td><div id=\"bond_double_preview\"></div>Double</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_triple\" title=\"Triple Bond (3)\">" +
"<td><div id=\"bond_triple_preview\"></div>Triple</td>" +
"</tr>" +
"<tr>" +
"<td class=\"dropdownListDelimiter\"></td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_up\" title=\"Single Up Bond (1)\">" +
"<td><div id=\"bond_up_preview\"></div>Single Up</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_down\" title=\"Single Down Bond (1)\">" +
"<td><div id=\"bond_down_preview\"></div>Single Down</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_updown\" title=\"Single Up/Down Bond (1)\">" +
"<td><div id=\"bond_updown_preview\"></div>Single Up/Down</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_crossed\" title=\"Double Cis/Trans Bond (2)\">" +
"<td><div id=\"bond_crossed_preview\"></div>Double Cis/Trans</td>" +
"</tr>" +
"<tr>" +
"<td class=\"dropdownListDelimiter\"></td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_any\" title=\"Any Bond (0)\">" +
"<td><div id=\"bond_any_preview\"></div>Any</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_aromatic\" title=\"Aromatic Bond (4)\">" +
"<td><div id=\"bond_aromatic_preview\"></div>Aromatic</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_singledouble\" title=\"Single/Double Bond\">" +
"<td><div id=\"bond_singledouble_preview\"></div>Single/Double</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_singlearomatic\" title=\"Single/Aromatic Bond\">" +
"<td><div id=\"bond_singlearomatic_preview\"></div>Single/Aromatic</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"bond_doublearomatic\" title=\"Double/Aromatic Bond\">" +
"<td><div id=\"bond_doublearomatic_preview\"></div>Double/Aromatic</td>" +
"</tr>" +
"</table>" +
"</div>" +
"" +
"<div class=\"dropdownList renderFirst\" id=\"template_dropdown_list\" style=\"display:none\">" +
"<table>" +
"<tr class=\"dropdownListItem\" id=\"template_0\" title=\"Benzene (T)\">" +
"<td><div id=\"template_0_preview\"></div>Benzene</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"template_1\" title=\"Cyclopentadiene (T)\">" +
"<td><div id=\"template_1_preview\"></div>Cyclopentadiene</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"template_2\" title=\"Cyclohexane (T)\">" +
"<td><div id=\"template_2_preview\"></div>Cyclohexane</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"template_3\" title=\"Cyclopentane (T)\">" +
"<td><div id=\"template_3_preview\"></div>Cyclopentane</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"template_4\" title=\"Cyclopropane (T)\">" +
"<td><div id=\"template_4_preview\"></div>Cyclopropane</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"template_5\" title=\"Cyclobutane (T)\">" +
"<td><div id=\"template_5_preview\"></div>Cyclobutane</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"template_6\" title=\"Cycloheptane (T)\">" +
"<td><div id=\"template_6_preview\"></div>Cycloheptane</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"template_7\" title=\"Cyclooctane (T)\">" +
"<td><div id=\"template_7_preview\"></div>Cyclooctane</td>" +
"</tr>" +
"</table>" +
"</div>" +
"" +
"<div class=\"dropdownList\" id=\"reaction_dropdown_list\" style=\"display:none\">" +
"<table>" +
"<tr class=\"dropdownListItem\" id=\"reaction_arrow\" title=\"Reaction Arrow Tool\">" +
"<td><div id=\"reaction_arrow_todo\"><img src=\"png/action/reaction-arrow.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>Reaction Arrow Tool</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"reaction_plus\" title=\"Reaction Plus Tool\">" +
"<td><div id=\"reaction_plus_todo\"><img src=\"png/action/reaction-plus.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>Reaction Plus Tool</td>" +
"</tr>" +
"<tr class=\"dropdownListItem serverRequired\" id=\"reaction_automap\" title=\"Reaction Mapping Tool\">" +
"<td><div id=\"reaction_automap_todo\"><img src=\"png/action/reaction-automap.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>Reaction Auto-Mapping</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"reaction_map\" title=\"Reaction Mapping Tool\">" +
"<td><div id=\"reaction_map_todo\"><img src=\"png/action/reaction-map.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>Reaction Mapping Tool</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"reaction_unmap\" title=\"Reaction Unmappping Tool\">" +
"<td><div id=\"reaction_unmap_todo\"><img src=\"png/action/reaction-unmap.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>Reaction Unmapping Tool</td>" +
"</tr>" +
"</table>" +
"</div>" +
"" +
"<div class=\"dropdownList\" id=\"rgroup_dropdown_list\" style=\"display:none\">" +
"<table>" +
"<tr class=\"dropdownListItem\" id=\"rgroup_label\" title=\"R-Group Label Tool (Shift+R)\">" +
"<td><div id=\"rgroup_label_todo\"><img src=\"png/action/rgroup-label.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>R-Group Label Tool</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"rgroup_fragment\" title=\"R-Group Fragment Tool (Shift+R)\">" +
"<td><div id=\"rgroup_fragment_todo\"><img src=\"png/action/rgroup-fragment.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>R-Group Fragment Tool</td>" +
"</tr>" +
"<tr class=\"dropdownListItem\" id=\"rgroup_attpoints\" title=\"Attachment Point Tool (Shift+R)\">" +
"<td><div id=\"rgroup_attpoints_todo\"><img src=\"png/action/rgroup-attpoints.png\" alt=\"\" style=\"width:24px;height:24px;\" /></div>Attachment Point Tool</td>" +
"</tr>" +
"</table>" +
"</div>" +
"" +
"<input id=\"input_label\" type=\"text\" maxlength=\"4\" size=\"4\" style=\"display:none;\" />" +
"" +
"<div id=\"window_cover\" style=\"width:0;height:0;display:none;\"><div id=\"loading\" style=\"display:none;\"></div></div>" +
"" +
"<div class=\"dialogWindow fileDialog\" id=\"open_file\" style=\"display:none;\">" +
"<div style=\"width:100%\">" +
"<div>" +
"Open File" +
"</div>" +
"<div style=\"height:0.5em\"></div>" +
"<div class=\"serverRequired\" style=\"font-size:small\">" +
"<input type=\"radio\" id=\"radio_open_from_input\" name=\"input_source\" checked>Input</input>" +
"<input type=\"radio\" id=\"radio_open_from_file\" name=\"input_source\">File</input>" +
"</div>" +
"<div class=\"serverRequired\" style=\"font-size:small\" align=\"left\">" +
"<input type=\"checkbox\" id=\"checkbox_open_copy\" name=\"open_mode\">Load as a fragment and copy to the Clipboard</input>" +
"</div>" +
"<div class=\"serverRequired\" id=\"open_from_file\">" +
"<form id=\"upload_mol\" style=\"margin-top:4px\" action=\"open\" enctype=\"multipart/form-data\" target=\"buffer_frame\" method=\"post\">" +
"<input type=\"file\" name=\"filedata\" id=\"molfile_path\" />" +
"<div style=\"margin-top:0.5em;text-align:center\">" +
"<input id=\"upload_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input type=\"submit\" value=\"OK\" />" +
"</div>" +
"</form>" +
"</div>" +
"<div style=\"margin:4px;\" id=\"open_from_input\">" +
"<textarea class=\"chemicalText\" id=\"input_mol\" wrap=\"off\"></textarea>" +
"<div style=\"margin-top:0.5em;text-align:center\">" +
"<input id=\"read_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input id=\"read_ok\" type=\"submit\" value=\"OK\" />" +
"</div>" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<div class=\"dialogWindow fileDialog\" id=\"save_file\" style=\"display:none;\">" +
"<div style=\"width:100%\">" +
"<div>" +
"Save File" +
"</div>" +
"<div style=\"height:0.5em\"></div>" +
"<div>" +
"<label>Format:</label>" +
"<select id=\"file_format\">Format:" +
"<option value=\"mol\">MDL/Symyx Molfile</option>" +
"<option value=\"smi\">Daylight SMILES</option>" +
"<!--option value=\"png\">Portable Network Graphics PNG</option>" +
"<option value=\"svg\">Scalable Vector Graphics SVG</option-->" +
"</select>" +
"</div>" +
"<div style=\"margin:4px;\">" +
"<textarea class=\"chemicalText\" id=\"output_mol\" wrap=\"off\" readonly></textarea>" +
"<form  id=\"download_mol\" style=\"margin-top:0.5em;text-align:center\" action=\"save\" enctype=\"multipart/form-data\" target=\"_self\" method=\"post\">" +
"<input type=\"hidden\" id=\"mol_data\" name=\"filedata\" />" +
"<input type=\"submit\" class=\"serverRequired\" value=\"Save...\" />" +
"<input id=\"save_ok\" type=\"button\" value=\"Close\" />" +
"</form>" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<div class=\"dialogWindow propDialog\" id=\"atom_properties\" style=\"display:none;\">" +
"<div style=\"width:100%\">" +
"<div>" +
"Atom Properties" +
"</div>" +
"<div style=\"height:0.5em\"></div>" +
"<table style=\"text-align:left\">" +
"<tr>" +
"<td>" +
"<label>Label:</label>" +
"</td>" +
"<td>" +
"<input id=\"atom_label\" type=\"text\" maxlength=\"2\" size=\"3\" />" +
"</td>" +
"<td rowspan=\"5\" style=\"width:5px\">" +
"</td>" +
"<td>" +
"<label>Number:</label>" +
"</td>" +
"<td>" +
"<input id=\"atom_number\" type=\"text\" readonly=\"readonly\" maxlength=\"3\" size=\"3\" />" +
"</td>" +
"<td rowspan=\"5\" style=\"width:10px\">" +
"</td>" +
"<td colspan=\"2\" style=\"background-color: #D7D7D7\">" +
"Query specific" +
"</td>" +
"</tr>" +
"<tr>" +
"<td>" +
"<label>Charge:</label>" +
"</td>" +
"<td>" +
"<input id=\"atom_charge\" type=\"text\" maxlength=\"3\" size=\"3\" />" +
"</td>" +
"<td>" +
"<label>Valency:</label>" +
"</td>" +
"<td>" +
"<select id=\"atom_valence\" style=\"width:100%\">" +
"<option value=\"\"></option>" +
"<option value=\"0\">0</option>" +
"<option value=\"1\">I</option>" +
"<option value=\"2\">II</option>" +
"<option value=\"3\">III</option>" +
"<option value=\"4\">IV</option>" +
"<option value=\"5\">V</option>" +
"<option value=\"6\">VI</option>" +
"<option value=\"7\">VII</option>" +
"<option value=\"8\">VIII</option>" +
"</select>" +
"</td>" +
"<td>" +
"<label>Ring bond count:</label>" +
"</td>" +
"<td>" +
"<select id=\"atom_ringcount\" style=\"width:100%\">" +
"<option value=\"0\"></option>" +
"<option value=\"-2\">As drawn</option>" +
"<option value=\"-1\">0</option>" +
"<option value=\"2\">2</option>" +
"<option value=\"3\">3</option>" +
"<option value=\"4\">4</option>" +
"</select>" +
"</td>" +
"</tr>" +
"<tr>" +
"<td>" +
"<label>Isotope:</label>" +
"</td>" +
"<td>" +
"<input id=\"atom_isotope\" type=\"text\" maxlength=\"3\" size=\"3\" />" +
"</td>" +
"<td>" +
"<label>Radical:</label>" +
"</td>" +
"<td>" +
"<select id=\"atom_radical\">" +
"<option value=\"0\"></option>" +
"<option value=\"2\">Monoradical</option>" +
"<option value=\"1\">Diradical (singlet)</option>" +
"<option value=\"3\">Diradical (triplet)</option>" +
"</select>" +
"</td>" +
"<td>" +
"<label>H count:</label>" +
"</td>" +
"<td>" +
"<select id=\"atom_hcount\" style=\"width:100%\">" +
"<option value=\"0\"></option>" +
"<option value=\"1\">0</option>" +
"<option value=\"2\">1</option>" +
"<option value=\"3\">2</option>" +
"<option value=\"4\">3</option>" +
"<option value=\"5\">4</option>" +
"</select>" +
"</td>" +
"</tr>" +
"<tr>" +
"<td colspan=\"5\" style=\"background-color: #D7D7D7\">" +
"Reaction flags" +
"</td>" +
"<td>" +
"<label>Substitution count:</label>" +
"</td>" +
"<td>" +
"<select id=\"atom_substitution\" style=\"width:100%\">" +
"<option value=\"0\"></option>" +
"<option value=\"-2\">As drawn</option>" +
"<option value=\"-1\">0</option>" +
"<option value=\"1\">1</option>" +
"<option value=\"2\">2</option>" +
"<option value=\"3\">3</option>" +
"<option value=\"4\">4</option>" +
"<option value=\"5\">5</option>" +
"<option value=\"6\">6</option>" +
"</select>" +
"</td>" +
"</tr>" +
"<tr>" +
"<td>" +
"<label>Inversion:</label>" +
"</td>" +
"<td>" +
"<select id=\"atom_inversion\">" +
"<option value=\"0\"></option>" +
"<option value=\"1\">Inverts</option>" +
"<option value=\"2\">Retains</option>" +
"</select>" +
"</td>" +
"<td>" +
"<label>Exact:</label>" +
"</td>" +
"<td>" +
"<select id=\"atom_exactchange\" style=\"width:100%\">" +
"<option value=\"0\"></option>" +
"<option value=\"1\">Exact change</option>" +
"</select>" +
"</td>" +
"<td>" +
"<label>Unsaturation:</label>" +
"</td>" +
"<td>" +
"<select id=\"atom_unsaturation\">" +
"<option value=\"0\"></option>" +
"<option value=\"1\">Unsaturated</option>" +
"</select>" +
"</td>" +
"</tr>" +
"</table>" +
"<div style=\"margin-top:0.5em\">" +
"<input id=\"atom_prop_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input id=\"atom_prop_ok\" type=\"button\" value=\"OK\" />" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<div class=\"dialogWindow propDialog\" id=\"atom_attpoints\" style=\"display:none;\">" +
"<div style=\"width:100%\">" +
"<div>" +
"Attachment Points" +
"</div>" +
"<table style=\"text-align:left\">" +
"<tr>" +
"<td>" +
"<input type=\"checkbox\" id=\"atom_ap1\">" +
"</td>" +
"<td>" +
"Primary attachment point" +
"</td>" +
"</tr>" +
"<tr>" +
"<td>" +
"<input type=\"checkbox\" id=\"atom_ap2\">" +
"</td>" +
"<td>" +
"Secondary attachment point" +
"</td>" +
"</tr>" +
"</table>" +
"<div style=\"height:0.5em\"></div>" +
"<div style=\"margin-top:0.5em\">" +
"<input id=\"atom_attpoints_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input id=\"atom_attpoints_ok\" type=\"button\" value=\"OK\" />" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<div class=\"dialogWindow propDialog\" id=\"bond_properties\" style=\"display:none;\">" +
"<div style=\"width:100%\">" +
"<div>" +
"Bond Properties" +
"</div>" +
"<div style=\"height:0.5em\"></div>" +
"<table style=\"text-align:left\">" +
"<tr>" +
"<td>" +
"<label>Type:</label>" +
"</td>" +
"<td>" +
"<select id=\"bond_type\" style=\"width:100%\">" +
"<option value=\"single\">Single</option>" +
"<option value=\"up\">Single Up</option>" +
"<option value=\"down\">Single Down</option>" +
"<option value=\"updown\">Single Up/Down</option>" +
"<option value=\"double\">Double</option>" +
"<option value=\"crossed\">Double Cis/Trans</option>" +
"<option value=\"triple\">Triple</option>" +
"<option value=\"aromatic\">Aromatic</option>" +
"<option value=\"any\">Any</option>" +
"<option value=\"singledouble\">Single/Double</option>" +
"<option value=\"singlearomatic\">Single/Aromatic</option>" +
"<option value=\"doublearomatic\">Double/Aromatic</option>" +
"</select>" +
"</td>" +
"</tr>" +
"<tr>" +
"<td>" +
"<label>Topology:</label>" +
"</td>" +
"<td>" +
"<select id=\"bond_topology\" style=\"width:100%\">" +
"<option value=\"0\">Either</option>" +
"<option value=\"1\">Ring</option>" +
"<option value=\"2\">Chain</option>" +
"</select>" +
"</td>" +
"</tr>" +
"<tr>" +
"<td>" +
"<label>Reacting Center:</label>" +
"</td>" +
"<td>" +
"<select id=\"bond_center\">" +
"<option value=\"0\">Unmarked</option>" +
"<option value=\"-1\">Not center</option>" +
"<option value=\"1\">Center</option>" +
"<option value=\"2\">No change</option>" +
"<option value=\"4\">Made/broken</option>" +
"<option value=\"8\">Order changes</option>" +
"<option value=\"12\">Made/broken and changes</option>" +
"<!--option value=\"5\">Order changes</option>" +
"<option value=\"9\">Order changes</option>" +
"<option value=\"13\">Order changes</option-->" +
"</select>" +
"</td>" +
"</tr>" +
"</table>" +
"<div style=\"margin-top:0.5em\">" +
"<input id=\"bond_prop_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input id=\"bond_prop_ok\" type=\"button\" value=\"OK\" />" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<div class=\"dialogWindow sgroupDialog\" id=\"sgroup_properties\" style=\"display:none;\">" +
"<div style=\"width:100%\">" +
"<div>" +
"S-Group Properties" +
"</div>" +
"<div style=\"height:0.5em\"></div>" +
"<table style=\"text-align:left\">" +
"<tr>" +
"<td>" +
"<label>Type:</label>" +
"</td>" +
"<td>" +
"<select id=\"sgroup_type\">" +
"<option value=\"GEN\">Generic</option>" +
"<option value=\"MUL\">Multiple group</option>" +
"<option value=\"SRU\">SRU polymer</option>" +
"<option value=\"SUP\">Superatom</option>" +
"<option value=\"DAT\">Data</option>" +
"</select>" +
"</td>" +
"</tr>" +
"<tr class=\"generalSGroup\">" +
"<td>" +
"<label>Connection:</label>" +
"</td>" +
"<td>" +
"<select id=\"sgroup_connection\">" +
"<option value=\"ht\">Head-to-tail</option>" +
"<option value=\"hh\">Head-to-head</option>" +
"<option value=\"eu\">Either unknown</option>" +
"</select>" +
"</td>" +
"</tr>" +
"<tr class=\"generalSGroup\">" +
"<td>" +
"<label>Label (subscript):</label>" +
"</td>" +
"<td>" +
"<input id=\"sgroup_label\" type=\"text\" maxlength=\"15\" size=\"15\" />" +
"</td>" +
"</tr>" +
"<tr class=\"dataSGroup\">" +
"<td>" +
"<label>Field name:</label>" +
"</td>" +
"<td>" +
"<input id=\"sgroup_field_name\" type=\"text\" maxlength=\"30\" size=\"30\" />" +
"</td>" +
"</tr>" +
"<tr class=\"dataSGroup\">" +
"<td>" +
"<label>Field value:</label>" +
"</td>" +
"</tr>" +
"<tr class=\"dataSGroup\">" +
"<td colspan=\"2\">" +
"<textarea class=\"dataSGroupValue\" id=\"sgroup_field_value\"></textarea>" +
"</td>" +
"</tr>" +
"<tr class=\"dataSGroup\">" +
"<td colspan=\"2\">" +
"<input type=\"radio\" id=\"sgroup_pos_absolute\" name=\"data_field_pos\" checked>Absolute</input>" +
"<input type=\"radio\" id=\"sgroup_pos_relative\" name=\"data_field_pos\">Relative</input>" +
"<input type=\"radio\" id=\"sgroup_pos_attached\" name=\"data_field_pos\">Attached</input>" +
"</td>" +
"</tr>" +
"</table>" +
"<div style=\"margin-top:0.5em\">" +
"<input id=\"sgroup_prop_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input id=\"sgroup_prop_ok\" type=\"button\" value=\"OK\" />" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<div class=\"dialogWindow automapDialog\" id=\"automap_properties\" style=\"display:none;\">" +
"<div style=\"width:100%\">" +
"<div>" +
"Reaction Auto-Mapping Parameter" +
"</div>" +
"<div style=\"height:0.5em\"></div>" +
"<table style=\"text-align:left\">" +
"<tr>" +
"<td>" +
"<label>Mode:</label>" +
"</td>" +
"<td>" +
"<select id=\"automap_mode\">" +
"<option value=\"discard\">Discard</option>" +
"<option value=\"keep\">Keep</option>" +
"<option value=\"alter\">Alter</option>" +
"<option value=\"clear\">Clear</option>" +
"</select>" +
"</td>" +
"</tr>" +
"</table>" +
"<div style=\"margin-top:0.5em\">" +
"<input id=\"automap_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input id=\"automap_ok\" type=\"button\" value=\"OK\" />" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<div class=\"dialogWindow elemTableDialog\" id=\"elem_table\" style=\"display:none;\">" +
"<div>" +
"<div>" +
"Periodic table" +
"</div>" +
"<div style=\"height:0.5em\"></div>" +
"<div id=\"elem_table_area\"></div>" +
"<div align=\"left\">" +
"<input type=\"radio\" id=\"elem_table_single\" name=\"atom_list\"" +
"onchange=\"if (!Prototype.Browser.IE) ui.elem_table_obj.setMode('single')\"" +
"onclick=\"if (Prototype.Browser.IE) ui.elem_table_obj.setMode('single')\"" +
">Single</input> <br />" +
"<input type=\"radio\" id=\"elem_table_list\" name=\"atom_list\"" +
"onchange=\"if (!Prototype.Browser.IE) ui.elem_table_obj.setMode('list')\"" +
"onclick=\"if (Prototype.Browser.IE) ui.elem_table_obj.setMode('list')\"" +
">List</input> <br />" +
"<input type=\"radio\" id=\"elem_table_notlist\" name=\"atom_list\"" +
"onchange=\"if (!Prototype.Browser.IE) ui.elem_table_obj.setMode('notlist')\"" +
"onclick=\"if (Prototype.Browser.IE) ui.elem_table_obj.setMode('notlist')\"" +
">Not List</input>" +
"</div>" +
"<div style=\"margin-top:0.5em\">" +
"<input id=\"elem_table_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input id=\"elem_table_ok\" type=\"button\" value=\"OK\" />" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<div class=\"dialogWindow rgroupTableDialog\" id=\"rgroup_table\" style=\"display:none;\">" +
"<div>" +
"<div>" +
"R-Group" +
"</div>" +
"<div style=\"height:0.5em\"></div>" +
"<div id=\"rgroup_table_area\"></div>" +
"<div style=\"margin-top:0.5em\">" +
"<input id=\"rgroup_table_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input id=\"rgroup_table_ok\" type=\"button\" value=\"OK\" />" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<div class=\"dialogWindow rlogicTableDialog\" id=\"rlogic_table\" style=\"display:none;\">" +
"<div style=\"width:100%\">" +
"<div>" +
"R-Group Logic" +
"</div>" +
"<div style=\"height:0.5em\"></div>" +
"<table style=\"text-align:left\">" +
"<tr>" +
"<td>" +
"<label for=\"rlogic_occurrence\">Occurrence:</label>" +
"<input id=\"rlogic_occurrence\" type=\"text\" maxlength=\"50\" size=\"10\" />" +
"</td>" +
"<td>" +
"<label for=\"rlogic_resth\">RestH:</label>" +
"<select id=\"rlogic_resth\">" +
"<option value=\"0\">Off</option>" +
"<option value=\"1\">On</option>" +
"</select>" +
"</td>" +
"<td>" +
"<label for=\"rlogic_if\">Condition:</label>" +
"<select id=\"rlogic_if\">" +
"<option value=\"0\">Always</option>" +
"</select>" +
"</td>" +
"</tr>" +
"</table>" +
"<div style=\"margin-top:0.5em\">" +
"<input id=\"rlogic_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input id=\"rlogic_ok\" type=\"button\" value=\"OK\" />" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<div class=\"dialogWindow reagenericsTableDialog\" id=\"reagenerics_table\" style=\"display:none;\">" +
"<div>" +
"<div>" +
"Reaxys Generics" +
"</div>" +
"<div style=\"height:0.5em\"></div>" +
"<div id=\"reagenerics_table_area\"></div>" +
"<div style=\"margin-top:0.5em\">" +
"<input id=\"reagenerics_table_cancel\" type=\"button\" value=\"Cancel\" />" +
"<input id=\"reagenerics_table_ok\" type=\"button\" value=\"OK\" disabled />" +
"</div>" +
"</div>" +
"</div>" +
"" +
"<iframe name=\"buffer_frame\" id=\"buffer_frame\" src=\"about:blank\" style=\"display:none\">" +
"</iframe>" +
"</div>" +
"";

